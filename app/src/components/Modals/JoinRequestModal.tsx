import {Button, Card, Modal} from "react-native-paper";
import useUserContext from "../../lib/user-context/hooks/UseUserContext";

export interface JoinRequestModalProps {
	open: boolean;
	close: () => void
	clientId?: {id: string, name: string}
	answerJoinRequest: (answer: { accepted: boolean, userId: string, name: string, room: string }) => void
}

export default function JoinRequestModal(props: JoinRequestModalProps) {

	const {user} = useUserContext();

	const deny = () => {
		if (props.clientId && user?.roomId) {
			props.answerJoinRequest({accepted: false, userId: props.clientId.id, name: props.clientId.name, room: user.roomId})
		}
		props.close()
	}

	const accept = () => {
		if (props.clientId && user?.roomId) {
			props.answerJoinRequest({accepted: true, userId: props.clientId.id, name: props.clientId.name, room: user.roomId})
		} else {
			console.log('client id not found')
		}
		props.close()
	}

	return (
		<Modal visible={props.open} onDismiss={props.close}>
			<Card>
				<Card.Title title={`${props.clientId?.name} wants to join your room`} subtitle={'Do you accept'}/>
				<Card.Actions>
					<Button onPress={accept}>Accept</Button>
					<Button onPress={deny}>Deny</Button>
				</Card.Actions>
			</Card>
		</Modal>
	)
}