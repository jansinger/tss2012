import type { LogbookFeature } from "./tooltip";

/**
 * Escapes HTML special characters to prevent XSS attacks.
 *
 * @param text - The text to escape
 * @returns Escaped text safe for HTML insertion
 */
// Use a singleton element for escaping to improve performance
const _escapeDiv = document.createElement('div');
const escapeHtml = (text: string): string => {
    _escapeDiv.textContent = text;
    return _escapeDiv.innerHTML;
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