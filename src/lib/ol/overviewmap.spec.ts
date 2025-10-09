import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createOverviewMap } from './overviewmap';
import { Map, View, Feature } from 'ol';
import { DEFAULTS } from './constants';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import Point from 'ol/geom/Point';
import type { Coordinates } from '$lib/types';

// Mock ResizeObserver for OpenLayers
(global as any).ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

describe('overviewmap factory', () => {
	let mapContainer: HTMLDivElement;

	beforeEach(() => {
		mapContainer = document.createElement('div');
		mapContainer.id = 'test-overview-map';
		document.body.appendChild(mapContainer);
	});

	afterEach(() => {
		document.body.removeChild(mapContainer);
	});

	describe('createOverviewMap', () => {
		it('creates a Map instance', () => {
			const map = createOverviewMap(mapContainer);
			expect(map).toBeInstanceOf(Map);
			map.dispose();
		});

		it('creates map with fixed zoom level of 9', () => {
			const map = createOverviewMap(mapContainer);
			const view = map.getView();

			expect(view.getZoom()).toBe(9);
			map.dispose();
		});

		it('creates map with default center coordinates', () => {
			const map = createOverviewMap(mapContainer);
			const view = map.getView();
			const center = view.getCenter();
			const expectedCenter = fromLonLat([DEFAULTS.lon, DEFAULTS.lat]);

			expect(center).toEqual(expectedCenter);
			map.dispose();
		});

		it('creates map with custom center coordinates', () => {
			const customCenter: Coordinates = [12.096666666667, 54.181666666667]; // Kiel area
			const map = createOverviewMap(mapContainer, customCenter);
			const view = map.getView();
			const center = view.getCenter();
			const expectedCenter = fromLonLat(customCenter);

			expect(center).toEqual(expectedCenter);
			map.dispose();
		});

		it('accepts HTMLElement as target', () => {
			const map = createOverviewMap(mapContainer);
			expect(map.getTarget()).toBe(mapContainer);
			map.dispose();
		});

		it('accepts string ID as target', () => {
			const map = createOverviewMap('test-overview-map');
			expect(map.getTargetElement()).toBe(mapContainer);
			map.dispose();
		});

		it('creates map with all required layers plus marker', () => {
			const map = createOverviewMap(mapContainer);
			const layers = map.getLayers().getArray();

			// Should have 4 layers: OSM, SeaMap, Track, and marker VectorLayer
			expect(layers).toHaveLength(4);
			map.dispose();
		});

		it('last layer is a VectorLayer with marker', () => {
			const map = createOverviewMap(mapContainer);
			const layers = map.getLayers().getArray();
			const markerLayer = layers[layers.length - 1];

			expect(markerLayer).toBeInstanceOf(VectorLayer);
			map.dispose();
		});

		it('marker layer contains a single point feature', () => {
			const map = createOverviewMap(mapContainer);
			const layers = map.getLayers().getArray();
			const markerLayer = layers[layers.length - 1] as VectorLayer<any>;
			const source = markerLayer.getSource();
			const features = source?.getFeatures();

			expect(features).toHaveLength(1);
			expect(features?.[0]).toBeInstanceOf(Feature);
			map.dispose();
		});

		it('marker feature is a Point geometry at correct location', () => {
			const customCenter: Coordinates = [10.0, 53.5];
			const map = createOverviewMap(mapContainer, customCenter);
			const layers = map.getLayers().getArray();
			const markerLayer = layers[layers.length - 1] as VectorLayer<any>;
			const source = markerLayer.getSource();
			const feature = source?.getFeatures()[0];
			const geometry = feature?.getGeometry();

			expect(geometry).toBeInstanceOf(Point);

			const coordinates = (geometry as Point).getCoordinates();
			const expectedCoords = fromLonLat(customCenter);
			expect(coordinates).toEqual(expectedCoords);
			map.dispose();
		});

		it('includes FullScreen control', () => {
			const map = createOverviewMap(mapContainer);
			const controls = map.getControls().getArray();

			// Should have default controls + FullScreen
			const hasFullScreen = controls.some((control) => control.constructor.name === 'FullScreen');
			expect(hasFullScreen).toBe(true);
			map.dispose();
		});

		it('has multiple controls (defaults + FullScreen)', () => {
			const map = createOverviewMap(mapContainer);
			const controls = map.getControls();

			// Should have at least 2 controls (Zoom, Attribution, FullScreen)
			expect(controls.getLength()).toBeGreaterThanOrEqual(2);
			map.dispose();
		});

		it('view has Web Mercator projection', () => {
			const map = createOverviewMap(mapContainer);
			const view = map.getView();
			const projection = view.getProjection();

			expect(projection.getCode()).toBe('EPSG:3857');
			map.dispose();
		});
	});

	describe('marker positioning', () => {
		it('marker updates with different center coordinates', () => {
			const center1: Coordinates = [10.0, 53.5];
			const center2: Coordinates = [13.0, 52.5];

			const map1 = createOverviewMap(mapContainer, center1);
			const layers1 = map1.getLayers().getArray();
			const markerLayer1 = layers1[layers1.length - 1] as VectorLayer<any>;
			const feature1 = markerLayer1.getSource()?.getFeatures()[0];
			const coords1 = (feature1?.getGeometry() as Point).getCoordinates();

			map1.dispose();

			const map2 = createOverviewMap(mapContainer, center2);
			const layers2 = map2.getLayers().getArray();
			const markerLayer2 = layers2[layers2.length - 1] as VectorLayer<any>;
			const feature2 = markerLayer2.getSource()?.getFeatures()[0];
			const coords2 = (feature2?.getGeometry() as Point).getCoordinates();

			expect(coords1).not.toEqual(coords2);
			map2.dispose();
		});

		it('marker is at map center', () => {
			const customCenter: Coordinates = [15.0, 55.0];
			const map = createOverviewMap(mapContainer, customCenter);

			const view = map.getView();
			const mapCenter = view.getCenter();

			const layers = map.getLayers().getArray();
			const markerLayer = layers[layers.length - 1] as VectorLayer<any>;
			const feature = markerLayer.getSource()?.getFeatures()[0];
			const markerCoords = (feature?.getGeometry() as Point).getCoordinates();

			expect(markerCoords).toEqual(mapCenter);
			map.dispose();
		});
	});

	describe('edge cases', () => {
		it('handles coordinates at equator and prime meridian', () => {
			const zeroCoords: Coordinates = [0, 0];
			const map = createOverviewMap(mapContainer, zeroCoords);
			const view = map.getView();

			expect(view.getCenter()).toEqual(fromLonLat(zeroCoords));
			map.dispose();
		});

		it('handles coordinates in western hemisphere', () => {
			const westernCoords: Coordinates = [-74.0, 40.7]; // New York
			const map = createOverviewMap(mapContainer, westernCoords);
			const view = map.getView();

			expect(view.getCenter()).toEqual(fromLonLat(westernCoords));
			map.dispose();
		});

		it('handles coordinates in southern hemisphere', () => {
			const southernCoords: Coordinates = [151.2, -33.9]; // Sydney
			const map = createOverviewMap(mapContainer, southernCoords);
			const view = map.getView();

			expect(view.getCenter()).toEqual(fromLonLat(southernCoords));
			map.dispose();
		});

		it('can create multiple independent overview maps', () => {
			const container1 = document.createElement('div');
			const container2 = document.createElement('div');
			document.body.appendChild(container1);
			document.body.appendChild(container2);

			const map1 = createOverviewMap(container1, [10.0, 53.0]);
			const map2 = createOverviewMap(container2, [13.0, 52.0]);

			expect(map1).not.toBe(map2);
			expect(map1.getView().getCenter()).not.toEqual(map2.getView().getCenter());

			map1.dispose();
			map2.dispose();
			document.body.removeChild(container1);
			document.body.removeChild(container2);
		});
	});
});
