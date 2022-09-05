import sanitizeHtml from 'sanitize-html';

const options = {
	allowedTags: [],
	allowedAttributes: {}
};
export const stripHtml = (text: string) => sanitizeHtml(text, options);
