import type { MapBrowserEvent } from 'ol';
import type OLMap from 'ol/Map';
import type Layer from 'ol/layer/Layer';

const LOGBOOK_LAYER_NAME = 'logbook';

/**
 * Layer filter function to identify logbook layer.
 * Extracted as a constant to avoid creating new function on every call.
 */
const logbookLayerFilter = (candidate: Layer) => candidate.get('name') === LOGBOOK_LAYER_NAME;

/**
 * Retrieves the feature at a specific event pixel on the map.
 *
 * This function filters features based on a specific layer name and returns
 * the first feature found at the event's pixel location.
 *
 * @param event - The map browser event containing information about the user interaction.
 * @param map - The OpenLayers Map instance on which to perform the feature lookup.
 * @returns The first feature found at the event pixel location on the specified layer,
 *          or undefined if no feature is found.
 */
export const getFeatureAtEventPixel = (event: MapBrowserEvent<PointerEvent>, map: OLMap) => {
	const pixel = map.getEventPixel(event.originalEvent);
	return map.getFeaturesAtPixel(pixel, { layerFilter: logbookLayerFilter })[0];
};
