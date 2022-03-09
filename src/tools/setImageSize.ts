import { sortedEntries } from '../lib/sortedEntries';
import sizeOf from 'image-size';
import fs from 'fs';

const correctedEntries = sortedEntries.map((entry) => {
	entry.pictures.forEach((picture) => {
		const img = `static/images/${entry.pictureFolder}/${picture.filename}`;
		const { height, width } = sizeOf(img);
		picture.sizebig = { height, width };
	});
	return entry;
});

console.log(correctedEntries);

fs.writeFileSync('src/lib/data/logbook.json', JSON.stringify(correctedEntries));
