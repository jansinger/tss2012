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
	// Remove HTML tags
	let clean = text.replace(/<[^>]*>/g, '');

	// Decode common HTML entities
	clean = clean
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'")
		.replace(/&apos;/g, "'");

	return clean.trim();
};
