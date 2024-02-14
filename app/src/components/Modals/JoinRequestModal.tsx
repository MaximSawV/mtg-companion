import {Button, Card, Modal} from "react-native-paper";

export interface JoinRequestModalProps {
	open: boolean;
	close: () => void
	clientId?: {id: string, name: string}
	answerJoinRequest: (answer: {accepted: boolean, clientId: string, name: string}) => void
}

export default function JoinRequestModal(props: JoinRequestModalProps) {

	const deny = () => {
		if (props.clientId) {
			props.answerJoinRequest({accepted: false, clientId: props.clientId.id, name: props.clientId.name})
		}
		props.close()
	}

	const accept = () => {
		if (props.clientId) {
			props.answerJoinRequest({accepted: true, clientId: props.clientId.id, name: props.clientId.name})
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