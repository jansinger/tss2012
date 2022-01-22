import logbookEntries from '$lib/data/logbook.json';

const options = {
	weekday: 'long' as const,
	year: 'numeric' as const,
	month: 'long' as const,
	day: 'numeric' as const
};

const mappedEntries = logbookEntries.rows.map((entry) => {
	const { doc } = entry;
	const datetime = new Date(Date.parse(doc.datetime));
	doc.datetime = datetime.toISOString();
	doc['localeDatetime'] = datetime.toLocaleDateString('de-DE', options);
	return doc;
});

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async ({ params }) => {
	const { id } = params;
	const entry = mappedEntries.find((row) => row._id === id);
	if (!entry) {
		return { status: 404, body: 'Not Found' };
	}
	return {
		status: 200,
		body: entry
	};
};
