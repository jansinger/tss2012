import { sortedEntries } from '$lib/sortedEntries';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => sortedEntries.map((entry) => ({ id: entry._id }));

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const index = sortedEntries.findIndex((row) => row._id === id);
	if (index === -1) {
		return error(404, 'Not Found');
	}
	const prev = index > 0 ? sortedEntries[index - 1]._id : undefined;
	const next = index < sortedEntries.length - 1 ? sortedEntries[index + 1]._id : undefined;
	return {
		entry: {
			_prev: prev,
			_next: next,
			...sortedEntries[index]
		}
	};
};
