import { sortedEntries } from '../lib/sortedEntries';
import sizeOf from 'image-size';
import fs from 'fs';

/**
 * Represents an array of entries with corrected picture sizes.
 * @typedef {Array} CorrectedEntries
 * @property {Array} pictures - An array of pictures for each entry.
 * @property {string} filename - The filename of the picture.
 * @property {Object} sizebig - The size of the picture (height and width).
 * @property {number} sizebig.height - The height of the picture.
 * @property {number} sizebig.width - The width of the picture.
 */

/**
 * Corrects the picture sizes for each entry in the sortedEntries array.
 * @param {Array} sortedEntries - An array of entries to be corrected.
 * @returns {CorrectedEntries} - An array of entries with corrected picture sizes.
 */
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
