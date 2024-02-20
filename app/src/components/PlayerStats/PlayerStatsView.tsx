import {Styles} from "../../styles";
import {Card, Icon, IconButton} from "react-native-paper";
import {GestureResponderEvent, Text, View} from "react-native";
import {ReactNode, useEffect, useState} from "react";
import {PlayerStats} from "../../App";
import * as Clipboard from 'expo-clipboard';
import useUserContext from "../../lib/user-context/hooks/UseUserContext";

export interface PlayerStatsViewProps {
	stats: PlayerStats
	setStats: (stats: PlayerStats) => void
	myTurn: boolean
}

export default function PlayerStatsView(props: PlayerStatsViewProps) {

	const {
		stats,
		setStats,
		myTurn,
	} = props;

	const {user} = useUserContext();

	const [firstSwipeCoordinate, setFirstSwipeCoordinate] = useState<{ x: number, y: number }>({x: 0, y: 0})
	const [currentStat, setCurrentStat] = useState<number>(0)
	const [isCommander, setIsCommander] = useState<boolean>(false)

	useEffect(() => {
		updateMainHitPoints()
	}, [isCommander]);

	const updateMainHitPoints = () => {
		const updatedStats = new Map(stats);
		const mainStat = updatedStats.get(0);
		if (mainStat) {
			const hp = isCommander ? 40 : 20;
			mainStat.default = hp;
			mainStat.currentValue = hp;
			updatedStats.set(0, mainStat);
			setStats(updatedStats);
		}
	}

	const toggleIsCommander = () => {
		setIsCommander(!isCommander);
	}

	const resetPoints = (statId: number) => {
		const updatedStats = new Map(stats);
		const stat = updatedStats.get(statId);
		if (stat) {
			stat.currentValue = stat.default || 0;
			updatedStats.set(statId, stat);
			setStats(updatedStats);
		}
	}

	const updateStat = (statId: number, increment: boolean) => {
		const updatedStats = new Map(stats);
		const stat = updatedStats.get(statId);
		if (stat) {
			if (increment) {
				stat.currentValue = Math.min(stat.currentValue + 1);
			} else {
				stat.currentValue = Math.max(stat.currentValue - 1, 0);
			}
			updatedStats.set(statId, stat);
			setStats(updatedStats);
		}
	}

	const determineSwipeDirection = (event: GestureResponderEvent) => {
		const {x, y} = firstSwipeCoordinate;
		const dx = event.nativeEvent.pageX - x;
		const dy = event.nativeEvent.pageY - y;
		if (Math.abs(dx) > Math.abs(dy)) {
			if (dx > 20) {
				if (currentStat > 0) {
					setCurrentStat(currentStat - 1);
				} else {
					setCurrentStat(stats.size - 1)
				}
			} else if (dx < -20) {
				if (stats.size > currentStat + 1) {
					setCurrentStat(currentStat + 1);
				} else {
					setCurrentStat(0)
				}
			}
		} else {
			if (dy > 20) {
				// down
				updateStat(currentStat, false)
			} else if (dy < -20) {
				// up
				updateStat(currentStat, true)
			}
		}
	}

	const copyToClipboard = async () => {
		try {
			await Clipboard.setStringAsync(user?.roomId || '')
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	return (
		<Card
			style={{
				borderRadius: 30,
				borderWidth: 15,
				borderColor: user?.roomId ? myTurn ? "lime" : "red" : "white",
				marginHorizontal: 5,
				display: 'flex',
				alignItems: 'center'
			}}
			onTouchStart={(e) => setFirstSwipeCoordinate({x: e.nativeEvent.pageX, y: e.nativeEvent.pageY})}
			onTouchEnd={determineSwipeDirection}
		>
			<Card.Title title={stats.get(currentStat)?.name} />
			<Card.Content>
				<Text style={{fontSize: 64}}>{stats.get(currentStat)?.currentValue}</Text>
			</Card.Content>
		</Card>
	)
}

/*<Card
			style={{
				...Styles.full,
				paddingTop: "10%",
				paddingHorizontal: "5%",
				display: "flex",
				flexDirection: "column"
			}}
			onTouchStart={(e) => setFirstSwipeCoordinate({x: e.nativeEvent.pageX, y: e.nativeEvent.pageY})}
			onTouchEnd={determineSwipeDirection}
		>
			<Card.Content style={{
				height: "80%",
				display: "flex",
				alignItems: "center",
				borderWidth: 15,
				borderRadius: 30,
				borderColor: user?.roomId ? myTurn ? "lime" : "red" : "white"
			}}>
				<Text style={{fontSize: 64}}>{stats.get(currentStat)?.currentValue}</Text>
				<Text>{stats.get(currentStat)?.name}</Text>
			</Card.Content>
			{/!*<Card.Actions style={{...Styles.centerVH, display: "flex"}}>
				<IconButton icon={'information-outline'} onPress={copyToClipboard}/>
				<IconButton icon={isCommander ? "shield-outline" : "sword-cross"} onPress={toggleIsCommander}/>
				<IconButton icon={'reload'} onPress={() => resetPoints(currentStat)}/>
			</Card.Actions>*!/}
		</Card>*/