import {PaperProvider} from "react-native-paper";
import App from "./src/App";
import {AppRegistry} from "react-native";
import { expo } from './app.json';

export default function Main() {
	return (
		<PaperProvider>
			<App />
		</PaperProvider>
	)
}

AppRegistry.registerComponent(expo.name, () => Main);