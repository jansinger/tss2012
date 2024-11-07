import type { LogbookFeature } from "./tooltip";

/**
 * Creates an HTML string for a tooltip based on the provided LogbookFeature.
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
    return `
    <div class="right glass">
      <img src="/images/${picture}" title="${pictureTitle}" />
      <div class="text-content">
        <time datetime="${datetime}">${localeDatetime}</time>
        <address>${section}</address>
        <h3>${title}</h3>
      </div>
      <i></i>
    </div>
  `;
};