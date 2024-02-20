import {PaperProvider} from "react-native-paper";
import App from "./src/App";
import {AppRegistry} from "react-native";
import { expo } from './app.json';
import UserContextProvider from "./src/lib/user-context/components/UserContextProvider";

export default function Main() {
	return (
		<UserContextProvider>
			<PaperProvider>
				<App />
			</PaperProvider>
		</UserContextProvider>
	)
}

AppRegistry.registerComponent(expo.name, () => Main);