import type { SortableEntry } from '$lib/types';

/**
 * Sorts an array of sortable entries in ascending order based on their datetime property.
 *
 * @template T - The type of the sortable entries.
 * @param {T[]} entries - The array of sortable entries to be sorted.
 * @returns {T[]} - The sorted array of sortable entries.
 */
export const sortEntries = <T extends SortableEntry>(entries: T[]): T[] => {
	return [...entries].sort(
		(a, b): number => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
	);
};
