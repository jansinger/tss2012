import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Cluster } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Text, Icon } from 'ol/style';
import type { FeatureLike } from 'ol/Feature';

/**
 * Maximum size of the style cache to prevent memory leaks.
 * In practice, cluster sizes rarely exceed 50 different values.
 */
const MAX_CACHE_SIZE = 100;

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
 * LRU-style cache for cluster styles.
 * Uses Map to maintain insertion order for basic LRU behavior.
 * When cache exceeds MAX_CACHE_SIZE, oldest entries are removed.
 */
const styleCache = new Map<number, Style>();

/**
 * Creates a style for a given cluster size.
 * @param size - Number of features in the cluster
 * @returns Style for the cluster
 */
function createClusterStyle(size: number): Style {
	if (size === 1) {
		return markerStyle;
	}

	return new Style({
		image: clusterImage,
		text: new Text({
			text: size.toString(),
			fill: new Fill({
				color: '#fff'
			})
		})
	});
}

/**
 * Generates a style for a feature in the logbook layer.
 *
 * This function determines the appropriate style for a feature based on the number of features it represents.
 * For single features, it uses a marker style. For clusters (multiple features), it uses a circular style with a text label.
 * Uses an LRU-style cache with a maximum size to prevent unbounded memory growth.
 *
 * @param feature - The OpenLayers feature to style (FeatureLike for compatibility with OpenLayers style function signature).
 * @returns The OpenLayers Style object to apply to the feature.
 */
function styleFunction(feature: FeatureLike): Style {
	const features = feature.get('features') as FeatureLike[] | undefined;
	const size: number = features?.length ?? 1;

	// Check cache first
	if (styleCache.has(size)) {
		const style = styleCache.get(size)!;
		// Move to end (most recently used) by re-inserting
		styleCache.delete(size);
		styleCache.set(size, style);
		return style;
	}

	// Evict oldest entry if cache is full
	if (styleCache.size >= MAX_CACHE_SIZE) {
		const oldestKey = styleCache.keys().next().value;
		if (oldestKey !== undefined) {
			styleCache.delete(oldestKey);
		}
	}

	// Create and cache new style
	const style = createClusterStyle(size);
	styleCache.set(size, style);
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
