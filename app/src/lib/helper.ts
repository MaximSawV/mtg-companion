import {PlayerStats} from "../App";

export const getNextAndLastKey = (stats: PlayerStats, currentStat: number) => {
	const keys = Array.from(stats.keys());
	const currentIndex = keys.indexOf(currentStat);
	const nextKeyIndex = (currentIndex + 1) % keys.length;
	const prevKeyIndex = (currentIndex - 1 + keys.length) % keys.length;
	const nextKey = keys[nextKeyIndex];
	const lastKey = keys[prevKeyIndex];
	return {nextKey, lastKey};
}