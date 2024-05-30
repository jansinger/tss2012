import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Cluster } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Text, Icon } from 'ol/style';

/**
 * Marker style for the logbook layer.
 */
export const markerStyle = new Style({
	image: new Icon({
		crossOrigin: 'anonymous',
		src: '/pics/marker-tss.svg',
		scale: 0.4,
		opacity: 1,
		anchor: [0.5, 100],
		anchorXUnits: 'fraction',
		anchorYUnits: 'pixels'
	})
});

/**
 * The source for the logbook layer.
 */
const source = new VectorSource({
	url: '/data/logbook_geo.json',
	format: new GeoJSON()
});

/**
 * The cluster source for the logbook layer.
 */
const clusterSource = new Cluster({
	distance: 50,
	minDistance: 20,
	source: source
});

/**
 * The style for the cluster image.
 */
const clusterImage = new CircleStyle({
	radius: 15,
	stroke: new Stroke({
		color: '#fff'
	}),
	fill: new Fill({
		color: '#2e6287'
	})
});

/**
 * The style cache for the logbook layer.
 */
const styleCache = {};

/**
 * The logbook layer.
 */
export const logbook = new VectorLayer({
	source: clusterSource,
	style: function (feature) {
		const size = feature.get('features').length;
		let style = styleCache[size];
		if (!style) {
			if (size === 1) {
				style = markerStyle;
			} else {
				style = new Style({
					image: clusterImage,
					text: new Text({
						text: size.toString(),
						fill: new Fill({
							color: '#fff'
						})
					})
				});
			}
			styleCache[size] = style;
		}
		return style;
	},
	properties: {
		name: 'logbook'
	}
});
