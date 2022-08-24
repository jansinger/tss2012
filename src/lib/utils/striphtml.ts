import DOMPurify from 'isomorphic-dompurify';

export const stripHtml = (text: string) => DOMPurify.sanitize(text);
