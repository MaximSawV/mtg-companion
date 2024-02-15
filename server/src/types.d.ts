export type Player = {
	id: string
	name: string
	roomId: string
	role: PlayerRole
}

export type User = {
	socketId: string
	players: Player[]
}

export type JoinRequestAnswer = {
	accepted: boolean,
	userId: string,
	name: string,
	room: string
}

export type PlayerRole = "MASTER"|"PLAYER"