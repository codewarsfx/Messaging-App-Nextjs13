import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//clss is for conditional functions
// while twmerge is for merging tailwing classes aking them more cleaner
export function cn(...input: ClassValue[]) {
	return twMerge(clsx(input));
}
