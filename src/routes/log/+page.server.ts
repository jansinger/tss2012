export const prerender = true;
import { sortedEntries } from '$lib/sortedEntries';
import { logEntryToShort } from '$lib/types';
import type { LogEntry } from '$lib/types';
import type { PageServerLoad } from './$types';

// Cast needed: JSON-inferred coordinates type is number[] but LogEntry expects [number, number]
const entries = sortedEntries.map((e) => logEntryToShort(e as LogEntry));

export const load: PageServerLoad = () => {
	return {
		entries
	};
};
