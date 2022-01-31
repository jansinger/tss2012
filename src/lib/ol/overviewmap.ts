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

export const createOverviewMap = (
	target: string | HTMLElement,
	center: number[] = [DEFAULTS.lon, DEFAULTS.lat]
) => {
	const lonLat = fromLonLat(center);
	const iconFeature = new Feature(new Point(lonLat));
	const featureLayer = new VectorLayer({
		style: markerStyle,
		source: new VectorSource({ features: [iconFeature] })
	});
	return new Map({
		target,
		layers: [osm(), seamap(), track(), featureLayer],
		view: new View({
			center: lonLat,
			zoom: 9
		})
	});
};
