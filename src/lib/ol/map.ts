import { Map, View } from 'ol';
import { osm } from './layers/osm';
import { track } from './layers/track';
import { seamap } from './layers/seamap';
import { logbook } from './layers/logbook';
import { fromLonLat } from 'ol/proj';
import { DEFAULTS } from './constants';

export const startLonLat = fromLonLat([DEFAULTS.lon, DEFAULTS.lat]);

export const createMap = (
	target: string | HTMLElement,
	zoom: number = DEFAULTS.zoom,
	center: number[] = startLonLat
) => {
	return new Map({
		target,
		layers: [osm(), seamap(), track(), logbook],
		view: new View({
			center,
			zoom
		})
	});
};
