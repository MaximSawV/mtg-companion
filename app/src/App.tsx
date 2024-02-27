import {StatusBar} from 'expo-status-bar';
import {Text, View} from 'react-native';
import {ComponentsStyles} from "./styles";
import {useEffect, useState} from "react";
import {Appbar, Button, Card, Snackbar} from "react-native-paper";
import RollDiceModal from "./components/Modals/RollDiceModal";
import StatFormModal from "./components/Modals/StatFormModal";
import {LogBox} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import CustomStatsView from "./components/Stats/CustomStatsView";
import StatsView from "./components/Stats/StatsView";
import AppbarAction from "react-native-paper/lib/typescript/components/Appbar/AppbarAction";

LogBox.ignoreLogs(['Animated.event now requires a second argument for options']);

export type PlayerStats = Map<number, { name: string, currentValue: number, default?: number }>;

const defaultStats: PlayerStats = new Map([
	[0, {name: "Main", currentValue: 40, default: 40}]
])

export default function App() {

	const [stats, setStats] = useState<PlayerStats>(defaultStats)
	const [commanderDamageCounter, setCommanderDamageCounter] = useState<PlayerStats>(new Map([]))
	const [currentStat, setCurrentStat] = useState<number>(0)
	const [openStatForm, setOpenStatForm] = useState<boolean>(false)
	const [openCommanderDamageForm, setOpenCommanderDamageForm] = useState(false)
	const [openDiceForm, setOpenDiceForm] = useState<boolean>(false)
	const [rolledNumber, setRolledNumber] = useState<number>()
	const [showSnackbar, setShowSnackbar] = useState<boolean>(false)

	const {bottom} = useSafeAreaInsets();

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

	const resetPoints = (statId: number) => {
		const updatedStats = new Map(stats);
		const stat = updatedStats.get(statId);
		if (stat) {
			stat.currentValue = stat.default || 0;
			updatedStats.set(statId, stat);
			setStats(updatedStats);
		}
	}

	const showStatFormModal = () => setOpenStatForm(true);
	const hideStatFormModal = () => setOpenStatForm(false);
	const showDiceFormModal = () => setOpenDiceForm(true);
	const hideDiceFormModal = () => setOpenDiceForm(false);

	// show and hide CommanderDamageFormModal
	const showCommanderDamageFormModal = () => setOpenCommanderDamageForm(true);
    const hideCommanderDamageFormModal = () => setOpenCommanderDamageForm(false);

	const updateCommanderDamage = (statId: number, value: number) => {
		const updatedStats = new Map(commanderDamageCounter);
		const stat = updatedStats.get(statId);
		if (stat) {
			stat.currentValue = value;
			updatedStats.set(statId, stat);
			setCommanderDamageCounter(updatedStats);
		}
	}

	const deleteCommanderDamage = (statId: number) => {
		const updatedStats = new Map(commanderDamageCounter);
		updatedStats.delete(statId);
		setCommanderDamageCounter(updatedStats);
	}

	return (
		<View style={ComponentsStyles.AppMainView}>
			<CustomStatsView stats={stats} setStats={setStats} currentStat={currentStat}
							 setCurrentStat={setCurrentStat}/>

			<View style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', flexDirection: 'row'}}>
				{Array.from(commanderDamageCounter.entries()).map(([id, value]) => (
					<StatsView
						key={id}
						statId={id}
						stat={value}
						updateStat={updateCommanderDamage}
						cardStyle={{width: '40%', margin: '2%'}}
						deleteCommander={deleteCommanderDamage}
					/>
				))}
			</View>

			<Appbar
				style={{
					backgroundColor: 'aquamarine',
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,
				}}
				safeAreaInsets={{bottom}}
			>
				<Appbar.Action icon={'plus'} onPress={showStatFormModal}/>
				<Appbar.Action icon={'dice-multiple'} onPress={showDiceFormModal}/>
				<Appbar.Action icon={'reload'} onPress={() => resetPoints(currentStat)}/>
				<Appbar.Action icon={'sword'} onPress={showCommanderDamageFormModal} />
			</Appbar>
			<StatusBar/>
			<StatFormModal stats={stats} setStats={setStats} hideStatFormModal={hideStatFormModal}
						   openStatForm={openStatForm} isCommanderDamage={false}/>
			<StatFormModal stats={commanderDamageCounter} setStats={setCommanderDamageCounter} hideStatFormModal={hideCommanderDamageFormModal}
						   openStatForm={openCommanderDamageForm} isCommanderDamage={true}/>
			<RollDiceModal openDiceForm={openDiceForm} hideDiceFormModal={hideDiceFormModal}
						   setRolledNumber={setRolledNumber}/>
			<Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
				<Text style={{color: "white"}}>Rolled Number: {rolledNumber}</Text>
			</Snackbar>
		</View>
	);
}
