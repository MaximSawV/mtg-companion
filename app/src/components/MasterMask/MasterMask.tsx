import {Card, IconButton} from "react-native-paper";
import {SectionList, Text} from "react-native";
import {useEffect, useState} from "react";
import {socket} from "../../lib/socket";
import useUserContext from "../../lib/user-context/hooks/UseUserContext";

interface MasterMaskProps {
	setMasterView: (boolean: boolean) => void
}

interface Player {
	name: string
	id: string
}

export default function MasterMask(props: MasterMaskProps) {

	const [players, setPlayers] = useState<Map<string, Player>>(new Map())
	const {user} = useUserContext();

	useEffect(() => {

		//Socket events
		function onGetPlayers(players: {name: string, id: string}[]) {
			console.log(players)
			setPlayers(prevPlayers => {
                const newPlayers = new Map(prevPlayers);
				for (const player of players) {
					console.log(player.id)
					newPlayers.set(player.id, {name: player.name, id: player.id});
				}
                return newPlayers;
            });
		}

		//Listen to socket
		socket.on('sendPlayers', onGetPlayers);

		//Remove listeners
		return () => {
			socket.off('sendPlayers', onGetPlayers)
		}

	}, []);

	useEffect(() => {
		socket.emit('getPlayers', {roomId: user.roomId})
	}, []);

	const renderPlayers = () => {
		return (
			<>
				{Array.from(players).map(([id, player]) => (
					<Card key={id}>
						<Card.Title title={player.name}/>
					</Card>
				))}
			</>
		)
	}

	return (
		<Card>
			<Card.Title title={'Game Master'}/>
			<Card.Content>
				{renderPlayers()}
            </Card.Content>
			<Card.Actions>
				<IconButton icon={'sword'} onPress={() => props.setMasterView(false)}/>
			</Card.Actions>
		</Card>
	)
}