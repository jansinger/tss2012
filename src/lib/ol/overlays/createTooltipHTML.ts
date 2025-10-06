import type { LogbookFeature } from './tooltip';

/**
 * Escapes HTML special characters to prevent XSS attacks.
 * Uses browser DOM API when available, falls back to regex for SSR.
 *
 * @param text - The text to escape
 * @returns Escaped text safe for HTML insertion
 */
const escapeHtml = (text: string): string => {
	// Browser-based escaping (most secure)
	if (typeof document !== 'undefined') {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}

	// Fallback for SSR: regex-based escaping
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
};

/**
 * Creates an HTML string for a tooltip based on the provided LogbookFeature.
 * All user-provided content is escaped to prevent XSS vulnerabilities.
 *
 * @param feature - The LogbookFeature object containing the data for the tooltip.
 * @param feature.title - The title of the logbook entry.
 * @param feature.datetime - The date and time of the entry in ISO format.
 * @param feature.localeDatetime - The localized date and time string.
 * @param feature.section - The section or location of the entry.
 * @param feature.picture - The filename of the associated picture.
 * @param feature.pictureTitle - The title or description of the picture.
 *
 * @returns A string containing HTML markup for the tooltip.
 */
export const createTooltipHTML = (feature: LogbookFeature): string => {
	const { title, datetime, localeDatetime, section, picture, pictureTitle } = feature;

	// Escape all user-provided content to prevent XSS
	const escapedTitle = escapeHtml(title);
	const escapedDatetime = escapeHtml(datetime);
	const escapedLocaleDatetime = escapeHtml(localeDatetime);
	const escapedSection = escapeHtml(section);
	const escapedPicture = escapeHtml(picture);
	const escapedPictureTitle = escapeHtml(pictureTitle);

	return `
    <div class="right glass">
      <img
        src="/images/${escapedPicture}"
        title="${escapedPictureTitle}"
        alt="${escapedPictureTitle}"
        loading="lazy"
        decoding="async"
        width="200"
      />
      <div class="text-content">
        <time datetime="${escapedDatetime}">${escapedLocaleDatetime}</time>
        <address>${escapedSection}</address>
        <h3>${escapedTitle}</h3>
      </div>
      <i></i>
    </div>
  `;
};
