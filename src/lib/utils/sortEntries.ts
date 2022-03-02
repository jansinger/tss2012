import type { SortableEntry } from '$lib/types';

export const sortEntries = <T extends SortableEntry>(entries: T[]): T[] => {
	return [...entries].sort(
		(a, b): number => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
	);
};
