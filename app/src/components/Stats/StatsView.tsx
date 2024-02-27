import {Card, IconButton} from "react-native-paper";
import {GestureResponderEvent, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {TextStyle, ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";

export interface StatsViewProps {
	statId: number,
	stat: { name: string, currentValue: number, default?: number }
	updateStat: (statId: number, newValue: number) => void,
	cardStyle?: ViewStyle,
	statHeaderStyle?: TextStyle,
	statNumberStyle?: TextStyle,
	deleteCommander: (id: number) => void
}

export default function StatsView(props: StatsViewProps) {

	const {
		statId,
		stat,
		updateStat,
		cardStyle,
		statHeaderStyle,
		statNumberStyle,
		deleteCommander
	} = props;

	const [firstSwipeCoordinate, setFirstSwipeCoordinate] = useState<{ x: number, y: number }>({x: 0, y: 0})
	const [borderColor, setBorderColor] = useState<string>('blue');

	const determineSwipeDirection = (event: GestureResponderEvent) => {
		const {y} = firstSwipeCoordinate;
		const dy = event.nativeEvent.pageY - y;
		if (dy > 20) {
			// down
			updateStat(statId, stat.currentValue - 1)
		} else if (dy < -20) {
			// up
			updateStat(statId, stat.currentValue + 1)
		}
	}

	useEffect(() => {

		if (stat.default) {
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

	}, [stat])


	return (
		<Card
			style={{...cardStyle, alignItems: 'center', display: 'flex'}}
			onTouchStart={(e) => setFirstSwipeCoordinate({x: e.nativeEvent.pageX, y: e.nativeEvent.pageY})}
			onTouchEnd={determineSwipeDirection}
		>
			<Text style={{...statHeaderStyle, textAlign: 'center'}}>{stat.name}</Text>
			<Card.Content style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
				<IconButton icon={'plus'} onPress={() => updateStat(statId, stat.currentValue + 1)}/>
				<Text style={statNumberStyle}>{stat.currentValue}</Text>
				<IconButton icon={'minus'} onPress={() => updateStat(statId, stat.currentValue - 1)}/>
			</Card.Content>
			<IconButton icon={'trash-can'} style={{alignSelf: 'center'}} onPress={() => deleteCommander(statId)}/>
		</Card>
	)
}