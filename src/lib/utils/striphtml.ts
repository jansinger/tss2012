import sanitizeHtml from 'sanitize-html';

const options = {
	allowedTags: [],
	allowedAttributes: {}
};
/**
 * Removes HTML tags from the given text.
 *
 * @param text - The text to strip HTML tags from.
 * @returns The text without HTML tags.
 */
export const stripHtml = (text: string) => sanitizeHtml(text, options);
