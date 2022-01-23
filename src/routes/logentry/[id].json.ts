import logbookEntries from '$lib/data/logbook.json';

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async ({ params }) => {
	const { id } = params;
	const entry = logbookEntries.find((row) => row._id === id);
	if (!entry) {
		return { status: 404, body: 'Not Found' };
	}
	return {
		status: 200,
		body: entry
	};
};
