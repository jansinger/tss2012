import { Map, View } from 'ol';
import { osm } from './layers/osm';
import { track } from './layers/track';
import { seamap } from './layers/seamap';
import { fromLonLat } from 'ol/proj';
import { DEFAULTS } from './constants';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import { markerStyle } from './layers/logbook';
import VectorSource from 'ol/source/Vector';
import { FullScreen, defaults as defaultControls } from 'ol/control';
import type { Coordinates } from '$lib/types';

/**
 * Creates an overview map with a given target element or selector and center coordinates.
 * @param target - The target element or selector where the map will be rendered.
 * @param center - The center coordinates of the map. Defaults to [DEFAULTS.lon, DEFAULTS.lat].
 * @returns A new instance of the Map class representing the overview map.
 */
export const createOverviewMap = (
	target: string | HTMLElement,
	center: Coordinates = [DEFAULTS.lon, DEFAULTS.lat]
) => {
	const lonLat = fromLonLat(center);
	const iconFeature = new Feature(new Point(lonLat));
	const featureLayer = new VectorLayer({
		style: markerStyle,
		source: new VectorSource({ features: [iconFeature] })
	});
	return new Map({
		target,
		controls: defaultControls().extend([new FullScreen()]),
		layers: [osm(), seamap(), track(), featureLayer],
		view: new View({
			center: lonLat,
			zoom: 9
		})
	});
};
