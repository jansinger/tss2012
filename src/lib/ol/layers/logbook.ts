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
 * Shared across all logbook layer instances for performance.
 */
const styleCache = {};

/**
 * Generates a style for a feature in the logbook layer.
 *
 * This function determines the appropriate style for a feature based on the number of features it represents.
 * For single features, it uses a marker style. For clusters (multiple features), it uses a circular style with a text label.
 *
 * @param {import('ol/Feature').default} feature - The OpenLayers feature to style.
 * @returns {Style} The OpenLayers Style object to apply to the feature.
 */
function styleFunction(feature) {
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
}

/**
 * Creates a new logbook layer with clustered markers.
 *
 * @returns {VectorLayer} A new vector layer for logbook entries
 */
export const logbook = () => {
	const source = new VectorSource({
		url: '/data/logbook_geo.json',
		format: new GeoJSON()
	});

	const clusterSource = new Cluster({
		distance: 50,
		minDistance: 20,
		source: source
	});

	return new VectorLayer({
		source: clusterSource,
		style: styleFunction,
		properties: {
			name: 'logbook'
		}
	});
};
