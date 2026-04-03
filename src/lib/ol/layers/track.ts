import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import KML from 'ol/format/KML';
import { Fill, Stroke, Style } from 'ol/style';

/**
 * The fill style for the track vector layer.
 */
const fill = new Fill({
	color: 'rgba(255,255,255,0.4)'
});

/**
 * The stroke style for the track vector layer.
 */
const stroke = new Stroke({
	color: 'red',
	width: 1.0
});

/**
 * The style for the track vector layer.
 */
const style = new Style({
	fill: fill,
	stroke: stroke
});

/**
 * Module-level singleton: shared across all track() calls so the KML file is
 * fetched and parsed only once, even when multiple map instances exist.
 */
const source = new VectorSource({
	url: '/data/segelsommer2012.kml',
	format: new KML({
		extractStyles: false
	})
});

/**
 * Creates a vector layer for displaying a track.
 * Each call returns a new VectorLayer backed by the shared VectorSource.
 * @returns {VectorLayer} The vector layer for the track.
 */
export const track = () =>
	new VectorLayer({
		source,
		style
	});
