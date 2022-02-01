export const stripHtml = (text: string) => text.replace(/<[^>]*>?/gm, '');
