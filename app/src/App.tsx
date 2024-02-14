import {StatusBar} from 'expo-status-bar';
import {Text, View} from 'react-native';
import {ComponentsStyles} from "./styles";
import {useEffect, useState} from "react";
import {IconButton, Snackbar} from "react-native-paper";
import PlayerStatsView from "./components/PlayerStats/PlayerStatsView";
import RollDiceModal from "./components/Modals/RollDiceModal";
import StatFormModal from "./components/Modals/StatFormModal";
import {socket} from "./lib/socket";
import JoinRoomModal from "./components/Modals/JoinRoomModal";
import {LogBox} from 'react-native';
import JoinRequestModal from "./components/Modals/JoinRequestModal";

LogBox.ignoreLogs(['Animated.event now requires a second argument for options']);

export type PlayerStats = Map<number, { name: string, currentValue: number, default?: number }>;

const defaultStats: PlayerStats = new Map([
	[0, {name: "Main", currentValue: 20, default: 20}]
])

export default function App() {

	const [stats, setStats] = useState<PlayerStats>(defaultStats)
	const [openStatForm, setOpenStatForm] = useState<boolean>(false)
	const [openDiceForm, setOpenDiceForm] = useState<boolean>(false)
	const [openJoinRoomForm, setOpenJoinRoomForm] = useState<boolean>(false)
	const [openJoinRequestModal, setOpenJoinRequestModal] = useState<boolean>(false)
	const [rolledNumber, setRolledNumber] = useState<number>()
	const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [currentRoom, setCurrentRoom] = useState<string>()
	const [myTurn, setMyTurn] = useState(false)
	const [joinRequest, setJoinRequest] = useState<{id: string, name: string}>()
	const [playerName, setPlayerName] = useState<string>('')

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

		function onSendRoom({roomId, name}: {roomId: string, name: string}) {
			setCurrentRoom(roomId)
			setPlayerName(name)
			console.log(name)
		}

		function onIsYourTurn(isMyTurn: boolean) {
			setMyTurn(isMyTurn)
		}

		function onJoinRequest(request: {id: string, name: string}) {
			console.log(`Join request from ${request.name}`)
			setOpenJoinRequestModal(true)
			setJoinRequest(request)
		}

		function onJoinRequestRejected() {
			console.log('rejected join request')
		}

		socket.on('connect', onConnect);
		socket.on('connect_error', onConnectError);
		socket.on('disconnect', onDisconnect);
		socket.on('send_room', onSendRoom)
		socket.on('your_turn', onIsYourTurn)
		socket.on('join_request:player_to_master', onJoinRequest)

		return () => {
			socket.off('connect', onConnect);
			socket.off('connect_error', onConnectError);
			socket.off('disconnect', onDisconnect);
			socket.off('send_room', onSendRoom)
			socket.off('your_turn', onIsYourTurn)
			socket.off('join_request:player_to_master', onJoinRequest)
		};
	}, []);

	const joinRoom = (roomId: string, playerName: string) => {
		console.log('Trying to join room')
		socket.emit('join_room', {roomId: roomId, playerName: playerName});
	}

	const answerJoinRequest = (answer: { accepted: boolean, clientId: string, name: string }) => {
		console.log('Sending answer')
		socket.emit('join_request:master_to_player', {...answer, room: currentRoom})
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
	const hideJoinRequestModal = () => setOpenJoinRequestModal(false);


	const actions = (
		<>
			<IconButton icon={'plus'} onPress={showStatFormModal}/>
			<IconButton icon={'dice-multiple'} onPress={showDiceFormModal}/>
			<IconButton icon={'door'} onPress={showJoinRoomModal}/>
		</>
	)

	return (
		<View style={ComponentsStyles.AppMainView}>
			<PlayerStatsView actions={actions} setStats={setStats} stats={stats} currentRoom={currentRoom}
							 myTurn={myTurn} playerName={playerName}/>
			<StatFormModal stats={stats} setStats={setStats} hideStatFormModal={hideStatFormModal}
						   openStatForm={openStatForm}/>
			<RollDiceModal openDiceForm={openDiceForm} hideDiceFormModal={hideDiceFormModal}
						   setRolledNumber={setRolledNumber}/>
			<JoinRoomModal open={openJoinRoomForm} close={hideJoinRoomModal} joinRoom={joinRoom}/>
			<JoinRequestModal open={openJoinRequestModal} close={hideJoinRequestModal} clientId={joinRequest}
							  answerJoinRequest={answerJoinRequest}/>
			<Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
				<Text style={{color: "white"}}>Rolled Number: {rolledNumber}</Text>
			</Snackbar>
			<StatusBar/>
		</View>
	);
}
