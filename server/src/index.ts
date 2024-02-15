import {v4} from 'uuid';
import {createServer} from "http";
import {Server, Socket} from "socket.io";
import Redis from "ioredis";
import {Player, JoinRequestAnswer} from "./types";
import {sendPlayersInRoom} from "./lib/functions";

const port = 8000;
const clients = new Map<string, Socket>();
const rooms = new Map<string, Player[]>

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
const io = new Server(server, { /* options */});



io.on("connection", (socket) => {


	redisClient.set()
	socket.data.id = uuid;

	socket.on("disconnect", (reason, description) => {
		console.log(`${reason.toString()} ${description}`)
	})

	socket.on("join_room", (request: { roomId: string, playerName: string }) => {

		const {roomId, playerName} = request

		if (socket) {
			if (io.sockets.adapter.rooms.get(roomId)) {
				rooms.get(roomId)?.forEach((player) => {
					if (player.role === "MASTER") {
						const roomMaster = clients.get(player.id);
						roomMaster?.emit("join_request:player_to_master", {id: socket.data.id, name: playerName});
					}
				})
			} else {
				socket.join(roomId)
				rooms.set(roomId, [{id: socket.data.id, role: "MASTER", name: playerName, roomId}])
				socket.emit('send_room', {roomId: roomId, name: playerName, role: "MASTER"})
			}
		}
	});

	socket.on("join_request:master_to_player", (answer: JoinRequestAnswer) => {
		const player = clients.get(answer.userId)

		if (player) {
			if (answer.accepted) {
				player.join(answer.room);
				player.rooms.forEach((roomId) => {
					if (roomId !== answer.room) {
						player.leave(roomId);
					}
				});
				rooms.get(answer.room)?.push({id: socket.data.id, role: "PLAYER", name: answer.name, roomId: answer.room});
				player.emit('send_room', {roomId: answer.room, name: answer.name, role: "PLAYER"});
				sendPlayersInRoom(socket, rooms);
			} else {
				player.emit("join_request_rejected");
			}
		} else {
			console.error(`Player: ${answer.userId} does not exist`)
		}
	})

	socket.on('getPlayers', () => {
		console.log("Sending players")
		sendPlayersInRoom(socket, rooms);
	})
});

server.listen(port, () => {
	console.log(`WebSocket server is running on port ${port}`);
});