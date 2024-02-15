import {Socket} from "socket.io";
import {Player} from "../types";

export function sendPlayersInRoom(socket: Socket, rooms: Map<string, Player[]>) {
	const currentRoom = rooms.get(Array.from(socket.rooms)[1])
	if (currentRoom) {
		const players = currentRoom.map(player => {
			return {
				name: player.playerName,
				id: player.clientId
			};
		});
		socket.emit('sendPlayers', players);
	}
}