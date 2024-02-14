import {Button, Card, Modal, TextInput} from "react-native-paper";
import {useState} from "react";

export interface JoinRoomModalProps {
	open: boolean;
	close: () => void
	joinRoom: (roomId: string, playerName: string) => void
}

export default function JoinRoomModal(props: JoinRoomModalProps) {

	const [roomId, setRoomId] = useState<string>()
	const [playerName, setPlayerName] = useState<string>('')

	const handleJoinRoom = () => {
		if (roomId) {
			props.joinRoom(roomId, playerName);
			props.close()
		}
	}

	return (
		<Modal visible={props.open} onDismiss={props.close}>
			<Card>
				<TextInput label={'RoomID'} value={roomId} onChange={text => setRoomId(text.nativeEvent.text)}/>
				<TextInput label={'Player Name'} value={playerName} onChange={text => setPlayerName(text.nativeEvent.text)}/>
				<Card.Actions>
					<Button onPress={handleJoinRoom}>Join Room</Button>
				</Card.Actions>
			</Card>
		</Modal>
	)
}