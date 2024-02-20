import {StatusBar} from 'expo-status-bar';
import {Text, View} from 'react-native';
import {ComponentsStyles} from "./styles";
import {useEffect, useState} from "react";
import {Appbar, IconButton, Snackbar} from "react-native-paper";
import PlayerStatsView from "./components/PlayerStats/PlayerStatsView";
import RollDiceModal from "./components/Modals/RollDiceModal";
import StatFormModal from "./components/Modals/StatFormModal";
import {socket} from "./lib/socket";
import JoinRoomModal from "./components/Modals/JoinRoomModal";
import {LogBox} from 'react-native';
import JoinRequestModal from "./components/Modals/JoinRequestModal";
import MasterMask from "./components/MasterMask/MasterMask";
import useUserContext from "./lib/user-context/hooks/UseUserContext";
import {useSafeAreaInsets} from "react-native-safe-area-context";

LogBox.ignoreLogs(['Animated.event now requires a second argument for options']);

export type PlayerStats = Map<number, { name: string, currentValue: number, default?: number }>;

const defaultStats: PlayerStats = new Map([
	[0, {name: "Main", currentValue: 20, default: 20}]
])

export default function App() {

	const {setUser, user} = useUserContext();

	const [stats, setStats] = useState<PlayerStats>(defaultStats)
	const [openStatForm, setOpenStatForm] = useState<boolean>(false)
	const [openDiceForm, setOpenDiceForm] = useState<boolean>(false)
	const [openJoinRoomForm, setOpenJoinRoomForm] = useState<boolean>(false)
	const [openJoinRequestModal, setOpenJoinRequestModal] = useState<boolean>(false)
	const [rolledNumber, setRolledNumber] = useState<number>()
	const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [myTurn, setMyTurn] = useState(false)
	const [joinRequest, setJoinRequest] = useState<{ id: string, name: string }>()
	const [masterView, setMasterView] = useState<boolean>(false)

	const { bottom } = useSafeAreaInsets();

	useEffect(() => {
		function onConnectError(err: Error) {
			console.log(err.message)
		}

		function onConnect() {
			setIsConnected(true);
		}

		function onSendId(id: string) {
			setUser({id})
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		function onSendRoom({roomId, name, role}: { roomId: string, name: string, role: string }) {
			if (user) {
				setUser({...user, name, roomId, role})
			} else {
				console.log('User does not exist')
			}
		}

		function onIsYourTurn(isMyTurn: boolean) {
			setMyTurn(isMyTurn)
		}

		function onJoinRequest(request: { id: string, name: string }) {
			setOpenJoinRequestModal(true)
			setJoinRequest(request)
		}

		function onJoinRequestRejected() {
			console.log('rejected join request')
		}

		socket.on('connect', onConnect);
		socket.on('sendId', onSendId)
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

	const answerJoinRequest = (answer: { accepted: boolean, userId: string, name: string, room: string }) => {
		console.log('Sending answer')
		socket.emit('join_request:master_to_player', answer)
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

	return (
		<View style={ComponentsStyles.AppMainView}>
			<Appbar.Header>
				<Appbar.Content title={user.name ?? user.id}/>
			</Appbar.Header>
			{!masterView && (
				<PlayerStatsView setStats={setStats} stats={stats} myTurn={myTurn}/>
			)}
			{masterView && (
				<MasterMask setMasterView={setMasterView}/>
			)}

			<Appbar
				style={{backgroundColor: 'aquamarine',
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,}}
				safeAreaInsets={{bottom}}
			>
				<Appbar.Action icon={'plus'} onPress={showStatFormModal}/>
				<Appbar.Action icon={'dice-multiple'} onPress={showDiceFormModal}/>
				<Appbar.Action icon={'door'} onPress={showJoinRoomModal}/>
				{user?.role === "MASTER" && (
					<Appbar.Action icon={'crown'} onPress={() => setMasterView(true)}/>
				)}
			</Appbar>
			<StatusBar/>
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
		</View>
	);
}
