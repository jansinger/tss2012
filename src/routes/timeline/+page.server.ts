export const prerender = true;

import { sortedEntries } from '$lib/sortedEntries';
import type { LogEntryShort } from '$lib/types';
import type { PageServerLoad } from './$types';

interface LogEntryWithKey extends LogEntryShort {
	key: string;
}

const monthNames = [
	'Januar',
	'Februar',
	'März',
	'April',
	'Mai',
	'Juni',
	'Juli',
	'August',
	'September',
	'Oktober',
	'November',
	'Dezember'
];

const entries: LogEntryWithKey[] = sortedEntries.map((entry) => ({
	id: entry._id,
	title: entry.title,
	section: entry.section,
	abstract: entry.abstract,
	datetime: entry.datetime,
	localeDatetime: entry.localeDatetime,
	picture: `${entry.pictureFolder}/${entry.pictures[0].filename}`,
	pictureTitle: entry.pictures[0].title,
	key: `${monthNames[new Date(entry.datetime).getMonth()]} ${new Date(
		entry.datetime
	).getFullYear()}`
}));

function groupBy<T extends Record<K, string>, K extends keyof T>(
	xs: T[],
	key: K
): Record<string, T[]> {
	return xs.reduce<Record<string, T[]>>((rv, x) => {
		const k = x[key];
		(rv[k] = rv[k] ?? []).push(x);
		return rv;
	}, {});
}

export const load: PageServerLoad = () => {
	return {
		groupedEntries: groupBy(entries, 'key')
	};
};
