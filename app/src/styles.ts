import {StyleSheet} from "react-native";

export const Styles = StyleSheet.create({
	full: {
		height: '100%',
		width: '100%',
	},
	centerVH: {
		alignItems: 'center',
		justifyContent: 'center',
		display: "flex",
	},
});

export enum Color {
	White = '#fff',
	Lightgrey = '#b0b0b0'
}

export const ComponentsStyles = StyleSheet.create({
	AppMainView: {
		...Styles.full,
		flex: 1,
		alignItems: 'center'
	},
	AppAddPlayerButton: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
	AppPlayerCardContainer: {
		padding: "5%",
		height: "100%",
		maxHeight: "100%",
		width: "100%",
		flexWrap: "wrap",
		backgroundColor: Color.Lightgrey,
		zIndex: 0,
	},
	AppPlayerCard: {
		height: "100%",
		width: "100%",
		flexDirection: "column",
		...Styles.centerVH
	},
	AppActions: {
		backgroundColor: Color.White,
		height: "6%",
		width: "100%",
		position: "absolute",
		bottom: 0,
		zIndex: 1,
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
	}
})