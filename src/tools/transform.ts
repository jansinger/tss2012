import logbookEntries from '$lib/data/logbook_orig.json';
import fs from 'fs';

const options = {
	weekday: 'long' as const,
	year: 'numeric' as const,
	month: 'long' as const,
	day: 'numeric' as const
};

const mappedEntries = logbookEntries.rows
	.map((entry) => {
		const { doc } = entry;
		const datetime = new Date(Date.parse(doc.datetime));
		doc.datetime = datetime.toISOString();
		doc['localeDatetime'] = datetime.toLocaleDateString('de-DE', options);
		doc.pictures = doc.pictures.map((pic) => ({
			...pic,
			filename: pic.filename.replace('.jpg', '_gr.jpg')
		}));
		return doc;
	})
	.filter((entry) => entry.visible);

fs.writeFileSync('src/lib/data/logbook.json', JSON.stringify(mappedEntries));
