import { v4 } from 'uuid';
import { createServer } from "http";
import {Server, Socket} from "socket.io";

const port = 8000;

const server = createServer();
const io = new Server(server, { /* options */ });

const clients = new Map<string, Socket>();
const rooms: string[] = []

io.on("connection", (socket) => {
	const uuid = v4();
	clients.set(uuid, socket);

	console.log(`${uuid} is connected`);

	const newRoomId = v4();
	rooms.push(newRoomId);

	socket.emit("send_room", newRoomId);
	socket.join(newRoomId)

	socket.on("join_room", (room: string) => {
		socket.join(room);
		socket.rooms.forEach((roomId) => {
			if (roomId !== room) {
				socket.leave(roomId)
			}
		})
    });
});

server.listen(port, () => {
	console.log(`WebSocket server is running on port ${port}`);
});