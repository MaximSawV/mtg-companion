import { v4 } from 'uuid';
import { createServer } from "http";
import {Server, Socket} from "socket.io";
import Redis from "ioredis";

const port = 8000;
const clients = new Map<string, Socket>();
const rooms = new Map<string, {clientId: string, role: 'MASTER'|'PLAYER', playerName: string}[]>

// REDIS
const redisClient = new Redis(6379, "redis_server")

redisClient.on('connect', () => {
	console.log('connected')
})

redisClient.on('error', (e) => {
	console.log(e.message)
})

// SOCKET.IO
const server = createServer();
const io = new Server(server, { /* options */ });

io.on("connection", (socket) => {
	const uuid = v4();
	clients.set(uuid, socket)
	socket.data.id = uuid;

	console.log(`${uuid} is connected`);

	socket.on("disconnect", (reason, description) => {
		console.log(`${reason.toString()} ${description}`)
	})

	socket.on("join_room", (request: { roomId: string, playerName: string }) => {

		const {roomId, playerName} = request

		if (socket) {
			console.log("Join Room")

			if(io.sockets.adapter.rooms.get(roomId)) {
				console.log("Send join request")
				rooms.get(roomId)?.forEach((player) => {
					if (player.role === "MASTER") {
						const roomMaster = clients.get(player.clientId);
						roomMaster?.emit("join_request:player_to_master", {id: socket.data.id, name: playerName});
					}
				})
			} else {
				console.log("Create Room")
				socket.join(roomId)
				rooms.set(roomId, [{clientId: socket.data.id, role: "MASTER", playerName: playerName}])
				socket.emit('send_room', {roomId: roomId, name: playerName})
			}
		}
	});

	socket.on("join_request:master_to_player", (answer: {accepted: boolean, clientId: string, name: string, room: string}) => {
		const player = clients.get(answer.clientId)

		console.log(`Got answer: ${answer}`)
		if (player) {
			if (answer.accepted) {
				player.join(answer.room);
				player.rooms.forEach((roomId) => {
					if (roomId !== answer.room) {
						player.leave(roomId);
					}
				});
				console.log("Answer was accepted")
				player.emit('send_room', {roomId: answer.room, name: answer.name});
			} else {
				console.log("Answer was denied")
				player.emit("join_request_rejected");
			}
		} else {
			console.log(`Player: ${answer.clientId} does not exist`)
		}
	})
});

server.listen(port, () => {
	console.log(`WebSocket server is running on port ${port}`);
});