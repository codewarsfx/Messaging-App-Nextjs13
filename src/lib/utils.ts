import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//clss is for conditional functions
// while twmerge is for merging tailwing classes aking them more cleaner
export function cn(...input: ClassValue[]) {
	return twMerge(clsx(input));
}

export function chatIDconstructot(id1: string, id2: string) {
	const sortedIds = [id1, id2].sort();

	return `${sortedIds[0]}--${sortedIds[1]}`;
}


export function toPusherKey(key: string) {
	return key.replace(/:/g,'__')
}