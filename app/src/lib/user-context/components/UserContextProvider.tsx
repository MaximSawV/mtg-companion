import {ReactNode, useState} from "react";
import {User, UserContext} from "../lib/UserContext";

export interface UserContextProviderProps {
	children: ReactNode
}

export default function UserContextProvider(props: UserContextProviderProps) {

	const [user, setUser] = useState<User>({})


	return (
        <UserContext.Provider value={{user, setUser}}>
            {props.children}
        </UserContext.Provider>
    );
}