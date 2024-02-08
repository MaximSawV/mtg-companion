import { v4 } from 'uuid';
import { createServer } from "http";
import {Server, Socket} from "socket.io";

const port = 8000;

const server = createServer();
const io = new Server(server, { /* options */ });

const clients = new Map<string, Socket>();
const rooms = new Map<string, {clientId: string, role: 'MASTER'|'PLAYER'}[]>

io.on("connection", (socket) => {
	const uuid = v4();
	clients.set(uuid, socket);

	console.log(`${uuid} is connected`);

	const newRoomId = v4();
	rooms.set(newRoomId, [{clientId: uuid, role: 'MASTER'}])

	socket.emit("send_room", newRoomId);
	socket.join(newRoomId);
});

io.on("join_room", (clientId: string, room: string) => {
	const socket = clients.get(clientId)
	if (socket) {
		console.log("Join Room")
		socket.join(room);
		socket.rooms.forEach((roomId) => {
			if (roomId !== room) {
				socket.leave(roomId)
			}
		})
		socket.emit("send_room", room);
	}
});

server.listen(port, () => {
	console.log(`WebSocket server is running on port ${port}`);
});