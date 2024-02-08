import {Button, Card, IconButton, Modal, TextInput} from "react-native-paper";
import {useState} from "react";

export interface JoinRoomModalProps {
	open: boolean;
	close: () => void
	joinRoom: (roomId: string) => void
}

export default function JoinRoomModal(props: JoinRoomModalProps) {

	const [roomId, setRoomId] = useState<string>()

	const handleJoinRoom = () => {
		if (roomId) {
			props.joinRoom(roomId);
		}
	}

	return (
		<Modal visible={props.open} onDismiss={props.close}>
			<Card>
				<TextInput label={'RoomID'} value={roomId} onChange={text => setRoomId}/>
				<Card.Actions>
					<Button onPress={handleJoinRoom}>Join Room</Button>
				</Card.Actions>
			</Card>
		</Modal>
	)
}