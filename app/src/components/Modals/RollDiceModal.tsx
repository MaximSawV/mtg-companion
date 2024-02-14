import {Button, Card, Modal, TextInput} from "react-native-paper";
import {useState} from "react";

export interface RollDiceModalProps {
	openDiceForm: boolean;
	hideDiceFormModal: () => void
	setRolledNumber: (diceSize: number) => void
}

export default function RollDiceModal(props: RollDiceModalProps) {

	const { setRolledNumber, openDiceForm, hideDiceFormModal } = props;

	const [diceSize, setDiceSize] = useState<number>(0)

	const rollDice = () => {
		if (diceSize) {
			const randomNumber = Math.floor(Math.random() * diceSize) + 1;
			setRolledNumber(randomNumber);
			hideDiceFormModal();
		}
	}

	return (
		<Modal
			visible={openDiceForm}
			onDismiss={hideDiceFormModal}
		>
			<Card>
				<Card.Content>
					<TextInput
						label={"Dice Sides"}
						value={diceSize?.toString()}
						onChange={text => setDiceSize(parseInt(text.nativeEvent.text.replace(/[^0-9]/g, '')))}
					/>
				</Card.Content>
				<Card.Actions>
					<Button onPress={rollDice}> Roll Dice </Button>
				</Card.Actions>
			</Card>
		</Modal>
	)
}