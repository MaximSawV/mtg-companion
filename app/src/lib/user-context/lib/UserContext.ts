import {createContext} from "react";

export interface User {
	id?: string
	name?: string
	roomId?: string
	role?: string
}

export interface UserContextInterface {
	user: User,
	setUser: (user: User) => void
}

export const UserContext = createContext<UserContextInterface|null>(null);