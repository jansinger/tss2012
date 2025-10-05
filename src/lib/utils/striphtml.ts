/**
 * Removes HTML tags from the given text using a simple regex.
 * Also decodes common HTML entities.
 *
 * This is a lightweight replacement for sanitize-html that works universally
 * (browser and server) without Node.js dependencies.
 *
 * @param text - The text to strip HTML tags from.
 * @returns The text without HTML tags.
 */
export const stripHtml = (text: string): string => {
	// Remove HTML tags (repeat until stable for nested/malformed tags)
	let clean = text;
	let prev;
	do {
		prev = clean;
		clean = clean.replace(/<[^>]*>/g, '');
	} while (clean !== prev);

	// Decode common HTML entities
	clean = clean
		.replace(/&nbsp;/g, ' ')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'")
		.replace(/&apos;/g, "'")
		.replace(/&amp;/g, '&');

	return clean.trim();
};
