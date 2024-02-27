import {Card, IconButton, Switch} from "react-native-paper";
import {GestureResponderEvent, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {PlayerStats} from "../../App";
import {getNextAndLastKey} from "../../lib/helper";

export interface CustomStatsViewProps {
	stats: PlayerStats
	setStats: (stats: PlayerStats) => void
	currentStat: number,
	setCurrentStat: (stat: number) => void
}

export default function CustomStatsView(props: CustomStatsViewProps) {

	const {
		stats,
		setStats,
		currentStat,
		setCurrentStat
	} = props;

	const [firstSwipeCoordinate, setFirstSwipeCoordinate] = useState<{ x: number, y: number }>({x: 0, y: 0})
	const [borderColor, setBorderColor] = useState<string>('blue');

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
			rotateThroughStats(dx)
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

	const rotateThroughStats = (dx: number) => {

		const {nextKey, lastKey} = getNextAndLastKey(stats, currentStat);

		if (stats.size > 1) {
			if (dx > 20) {
				setCurrentStat(lastKey)
			} else if (dx < -20) {
				setCurrentStat(nextKey)
			}
		}
	}

	useEffect(() => {
		const stat = stats.get(currentStat);

		if (stat && stat.default) {
			const percentage = (stat.currentValue / stat.default) * 100;
			if (percentage >= 75) {
				setBorderColor('lime');
			} else if (percentage >= 50) {
				setBorderColor('yellow');
			} else if (percentage >= 25) {
				setBorderColor('orange');
			} else {
				setBorderColor('red');
			}
		} else {
			setBorderColor('blue');
		}

	}, [stats, currentStat])

	// function to remove stat from map
	const removeStat = () => {
        if (currentStat !== 0) {
			rotateThroughStats(-21)
			const updatedStats = new Map(stats);
			updatedStats.delete(currentStat);
			setStats(updatedStats);
		}
    }

	return (
		<Card
			style={{
				borderRadius: 30,
				borderWidth: 15,
				borderColor: borderColor,
				marginTop: '10%',
				display: 'flex',
				alignItems: 'center',
				width: '90%',
				alignContent: 'center'
			}}
			onTouchStart={(e) => setFirstSwipeCoordinate({x: e.nativeEvent.pageX, y: e.nativeEvent.pageY})}
			onTouchEnd={determineSwipeDirection}
		>
			<View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
				<IconButton icon={'chevron-left'} onPress={() => rotateThroughStats(21)}/>
				<Text>{stats.get(currentStat)?.name}</Text>
				<IconButton icon={'chevron-right'} onPress={() => rotateThroughStats(-21)}/>
			</View>
			<Card.Content style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
				<IconButton icon={'minus'} onPress={() => updateStat(currentStat, false)}/>
				<Text style={{fontSize: 96}}>{stats.get(currentStat)?.currentValue}</Text>
				<IconButton icon={'plus'} onPress={() => updateStat(currentStat, true)}/>
			</Card.Content>
			<IconButton icon={'trash-can'} disabled={currentStat === 0} style={{alignSelf: 'center'}} onPress={removeStat}/>
		</Card>
	)
}