import {Button, Card, Modal, TextInput} from "react-native-paper";
import {useState} from "react";
import {PlayerStats} from "./App";

export interface StatFormModalProps {
	stats: PlayerStats
	setStats: (playerStats: PlayerStats) => void
	hideStatFormModal: () => void
	openStatForm: boolean
}

export default function StatFormModal(props: StatFormModalProps) {

	const { stats, setStats, hideStatFormModal, openStatForm } = props;

	const [newStatName, setNewStatName] = useState<string>('')
	const [newStatCurrentValue, setNewStatCurrentValue] = useState<number>()
	const [newStatDefaultValue, setNewStatDefaultValue] = useState<number>()

	const addNewStat = () => {
		if (newStatName !== '') {
			const updatedStats = new Map(stats);
			const newStat: { name: string, currentValue: number, default?: number } = {
				name: newStatName,
				currentValue: newStatCurrentValue || 0,
				default: newStatDefaultValue
			};
			updatedStats.set(stats.size, newStat);
			setStats(updatedStats);
			setNewStatName('');
			setNewStatCurrentValue(undefined);
			setNewStatDefaultValue(undefined);
			hideStatFormModal();
		}
	}

	return (
		<Modal
			visible={openStatForm}
			onDismiss={hideStatFormModal}
		>
			<Card>
				<Card.Content>
					<TextInput
						label={"Stat Name"}
						value={newStatName}
						onChange={text => setNewStatName(text.nativeEvent.text)}
					/>
					<TextInput
						label={"Current Value"}
						value={newStatCurrentValue?.toString()}
						onChange={text => setNewStatCurrentValue(parseInt(text.nativeEvent.text))}
					/>
					<TextInput
						label={"Default Value"}
						value={newStatDefaultValue?.toString()}
						onChange={text => setNewStatDefaultValue(parseInt(text.nativeEvent.text))}
					/>
				</Card.Content>
				<Card.Actions>
					<Button onPress={addNewStat}> Add Stat </Button>
				</Card.Actions>
			</Card>
		</Modal>
	)
}