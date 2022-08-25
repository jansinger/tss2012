export const prerender = true;
import LogbookEntries from '$lib/components/LogbookEntries.svelte';
import origEntries from '$lib/data/logbook.json';
import type { LogEntryShort } from '$lib/types';

const entries: LogEntryShort[] = origEntries.map((entry) => ({
	id: entry._id,
	title: entry.title,
	section: entry.section,
	abstract: entry.abstract,
	datetime: entry.datetime,
	localeDatetime: entry.localeDatetime,
	picture: `${entry.pictureFolder}/${entry.pictures[0].filename}`,
	pictureTitle: entry.pictures[0].title
}));

/** @type {import('./$types').PageLoad} */
export function load() {
	return {
	  entries
	};
}