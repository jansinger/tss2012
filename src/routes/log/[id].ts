import { sortedEntries } from '$lib/sortedEntries';

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async ({ params }) => {
	const { id } = params;
	const index = sortedEntries.findIndex((row) => row._id === id);
	if (index === -1) {
		return { status: 404, body: 'Not Found' };
	}
	const prev = index > 0 ? sortedEntries[index - 1]._id : undefined;
	const next = index < sortedEntries.length - 1 ? sortedEntries[index + 1]._id : undefined;
	return {
		status: 200,
		body: {
			entry: {
				_prev: prev,
				_next: next,
				...sortedEntries[index]
			}
		}
	};
};
