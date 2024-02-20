import {useContext} from "react";
import {UserContext} from "../lib/UserContext";

export default function useUserContext() {

	const context = useContext(UserContext);

	if (context === null) {
		throw new Error('Sollte da sein')
	}

	return context
}