import {StatusBar} from 'expo-status-bar';
import {Text, View} from 'react-native';
import {ComponentsStyles} from "./styles";
import {useEffect, useState} from "react";
import {IconButton, Snackbar} from "react-native-paper";
import PlayerStatsView from "./PlayerStatsView";
import RollDiceModal from "./RollDiceModal";
import StatFormModal from "./StatFormModal";
import useWebSocket from "react-use-websocket";
import {socket} from "./lib/socket";
import JoinRoomModal from "./JoinRoomModal";

export type PlayerStats = Map<number, { name: string, currentValue: number, default?: number }>;

const defaultStats: PlayerStats = new Map([
	[0, {name: "Main", currentValue: 20, default: 20}]
])

export default function App() {

	const [stats, setStats] = useState<PlayerStats>(defaultStats)
	const [openStatForm, setOpenStatForm] = useState<boolean>(false)
	const [openDiceForm, setOpenDiceForm] = useState<boolean>(false)
	const [openJoinRoomForm, setOpenJoinRoomForm] = useState<boolean>(false)
	const [rolledNumber, setRolledNumber] = useState<number>()
	const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [currentRoom, setCurrentRoom] = useState<string>()


	useEffect(() => {
		function onConnectError(err: Error) {
			console.log(err.message)
		}

		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		function onSendRoom(roomId: string) {
			setCurrentRoom(roomId)
			console.log(roomId)
		}

		socket.on('connect', onConnect);
		socket.on('connect_error', onConnectError);
		socket.on('disconnect', onDisconnect);
		socket.on('send_room', onSendRoom)

		return () => {
			socket.off('connect', onConnect);
			socket.off('connect_error', onConnectError);
			socket.off('disconnect', onDisconnect);
			socket.off('send_room', onSendRoom)
		};
	}, []);

	const joinRoom = (roomId: string) => {
		socket.emit('join_room', roomId);
	}

	useEffect(() => {
		if (rolledNumber) {
			setShowSnackbar(true)
			console.log(rolledNumber)
			setTimeout(() => {
				setShowSnackbar(false);
				setRolledNumber(undefined);
			}, 2000)
		}
	}, [rolledNumber]);

	const showStatFormModal = () => setOpenStatForm(true);
	const hideStatFormModal = () => setOpenStatForm(false);
	const showDiceFormModal = () => setOpenDiceForm(true);
	const hideDiceFormModal = () => setOpenDiceForm(false);
	const showJoinRoomModal = () => setOpenJoinRoomForm(true);
	const hideJoinRoomModal = () => setOpenJoinRoomForm(false);


	const actions = (
		<>
			<IconButton icon={'plus'} onPress={showStatFormModal}/>
			<IconButton icon={'dice-multiple'} onPress={showDiceFormModal}/>
			<IconButton icon={'door'} onPress={showJoinRoomModal}/>
		</>
	)

	return (
		<View style={ComponentsStyles.AppMainView}>
			<PlayerStatsView actions={actions} setStats={setStats} stats={stats} currentRoom={currentRoom}/>
			<StatFormModal stats={stats} setStats={setStats} hideStatFormModal={hideStatFormModal}
						   openStatForm={openStatForm}/>
			<RollDiceModal openDiceForm={openDiceForm} hideDiceFormModal={hideDiceFormModal}
						   setRolledNumber={setRolledNumber}/>
			<JoinRoomModal open={openJoinRoomForm} close={hideJoinRoomModal} joinRoom={joinRoom}/>
			<Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
				<Text style={{color: "white"}}>Rolled Number: {rolledNumber}</Text>
			</Snackbar>
			<StatusBar/>
		</View>
	);
}
