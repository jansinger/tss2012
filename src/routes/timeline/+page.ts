export const prerender = true;

import { sortedEntries } from '$lib/sortedEntries';
import type { LogEntryShort } from '$lib/types';

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

const entries: LogEntryShort[] = sortedEntries.map((entry) => ({
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

const groupBy = function (xs: LogEntryShort[], key: string) {
	return xs.reduce(function (rv, x) {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
};

//const groupedEntries: { [key: string]: LogEntryShort[] } = groupBy(entries, 'key');

/** @type {import('./$types').PageLoad} */
export function load() {
	  return {
		groupedEntries: groupBy(entries, 'key')
	  };

  }