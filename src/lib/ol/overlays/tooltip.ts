import { Overlay } from 'ol';
import type { Feature, MapBrowserEvent } from 'ol';
import type OLMap from 'ol/Map';
import type BaseEvent from 'ol/events/Event';
import type Geometry from 'ol/geom/Geometry';
import type RenderFeature from 'ol/render/Feature';
import { createTooltipHTML } from './createTooltipHTML';
import { getFeatureAtEventPixel } from './getFeatureAtEventPixel';

const CLICK_LOGBOOK_EVENT = 'clickLogbook';

export interface LogbookFeature {
	title: string;
	datetime: string;
	localeDatetime: string;
	section: string;
	picture: string;
	pictureTitle: string;
	id?: string;
}

/**
 * Creates a tooltip overlay for a map and sets up event handlers for interactions.
 *
 * @param element - The HTML element to use as the container for the tooltip.
 * @param map - The OpenLayers Map instance to which the tooltip overlay will be added.
 * @returns An OpenLayers Overlay instance representing the tooltip.
 */
export const createTooltipOverlay = (element: HTMLElement, map: OLMap): Overlay => {
	const overlay = new Overlay({
		element,
		offset: [5, 0],
		positioning: 'bottom-left',
		autoPan: { animation: { duration: 250 } }
	});

	let currentFeature: Feature<Geometry> | RenderFeature | null = null;

	// Cache for tooltip HTML content, keyed by entry ID
	const tooltipCache = new Map<string, string>();

	const hideTooltip = () => {
		map.getTargetElement().style.cursor = '';
		overlay.setPosition(undefined);
		currentFeature = null;
	};

	const showTooltip = (feature: Feature<Geometry> | RenderFeature, coordinate: number[]) => {
		const features = feature.get('features');
		if (features && features.length === 1) {
			map.getTargetElement().style.cursor = 'pointer';
			currentFeature = feature;

			const featureData = features[0].getProperties() as LogbookFeature;
			// Use id if present, otherwise generate a unique key from feature properties
			const entryKey = featureData.id ?? JSON.stringify(featureData);

			// Check cache first
			let html = tooltipCache.get(entryKey);
			if (!html) {
				// Generate and cache if not found
				html = createTooltipHTML(featureData);
				tooltipCache.set(entryKey, html);
			}

			element.innerHTML = html;
			overlay.setPosition(coordinate);
		}
	};

	const handleFeatureInteraction = (evt: MapBrowserEvent<PointerEvent>, isClick: boolean) => {
		const newFeature = getFeatureAtEventPixel(evt, map);

		if (isClick && newFeature) {
			hideTooltip();
			map.dispatchEvent({ type: CLICK_LOGBOOK_EVENT, feature: newFeature } as unknown as BaseEvent);
		} else if (newFeature && (!currentFeature || currentFeature !== newFeature)) {
			showTooltip(newFeature, evt.coordinate);
		} else if (!newFeature) {
			hideTooltip();
		} else if (currentFeature) {
			overlay.setPosition(evt.coordinate);
		}
	};

	const handleClick = (evt: MapBrowserEvent<PointerEvent>) => handleFeatureInteraction(evt, true);
	const handlePointerMove = (evt: MapBrowserEvent<PointerEvent>) =>
		handleFeatureInteraction(evt, false);

	map.addOverlay(overlay);
	map.on('click', handleClick);
	map.on('pointermove', handlePointerMove);

	return overlay;
};
