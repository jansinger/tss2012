import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createMap, startLonLat } from './map';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { DEFAULTS } from './constants';
import { fromLonLat } from 'ol/proj';

// Mock ResizeObserver for OpenLayers
(global as any).ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

describe('map factory', () => {
	let mapContainer: HTMLDivElement;

	beforeEach(() => {
		// Create a container element for the map
		mapContainer = document.createElement('div');
		mapContainer.id = 'test-map';
		document.body.appendChild(mapContainer);
	});

	afterEach(() => {
		// Clean up
		document.body.removeChild(mapContainer);
	});

	describe('createMap', () => {
		it('creates a Map instance', () => {
			const map = createMap(mapContainer);
			expect(map).toBeInstanceOf(Map);
			map.dispose();
		});

		it('creates map with default zoom level', () => {
			const map = createMap(mapContainer);
			const view = map.getView();

			expect(view.getZoom()).toBe(DEFAULTS.zoom);
			map.dispose();
		});

		it('creates map with custom zoom level', () => {
			const customZoom = 10;
			const map = createMap(mapContainer, customZoom);
			const view = map.getView();

			expect(view.getZoom()).toBe(customZoom);
			map.dispose();
		});

		it('creates map with default center coordinates', () => {
			const map = createMap(mapContainer);
			const view = map.getView();
			const center = view.getCenter();

			expect(center).toEqual(startLonLat);
			map.dispose();
		});

		it('creates map with custom center coordinates', () => {
			const customCenter = fromLonLat([10.0, 53.5]); // Hamburg
			const map = createMap(mapContainer, DEFAULTS.zoom, customCenter);
			const view = map.getView();
			const center = view.getCenter();

			expect(center).toEqual(customCenter);
			map.dispose();
		});

		it('accepts HTMLElement as target', () => {
			const map = createMap(mapContainer);
			expect(map.getTarget()).toBe(mapContainer);
			map.dispose();
		});

		it('accepts string ID as target', () => {
			const map = createMap('test-map');
			expect(map.getTargetElement()).toBe(mapContainer);
			map.dispose();
		});

		it('creates map with all required layers', () => {
			const map = createMap(mapContainer);
			const layers = map.getLayers().getArray();

			// Should have 4 layers: OSM, SeaMap, Track, Logbook
			expect(layers).toHaveLength(4);
			map.dispose();
		});

		it('layers are in correct order by type', () => {
			const map = createMap(mapContainer);
			const layers = map.getLayers().getArray();

			// Layer order matters: base layers first, then overlays
			// OSM (TileLayer), SeaMap (TileLayer), Track (VectorLayer), Logbook (VectorLayer)
			expect(layers[0]).toBeInstanceOf(TileLayer);
			expect(layers[1]).toBeInstanceOf(TileLayer);
			expect(layers[2]).toBeInstanceOf(VectorLayer);
			expect(layers[3]).toBeInstanceOf(VectorLayer);
			map.dispose();
		});

		it('creates map with View instance', () => {
			const map = createMap(mapContainer);
			const view = map.getView();

			expect(view).toBeInstanceOf(View);
			map.dispose();
		});
	});

	describe('startLonLat constant', () => {
		it('is correctly projected from DEFAULTS coordinates', () => {
			const expected = fromLonLat([DEFAULTS.lon, DEFAULTS.lat]);
			expect(startLonLat).toEqual(expected);
		});

		it('is in Web Mercator projection (EPSG:3857)', () => {
			// Web Mercator coordinates are different from lon/lat
			// Longitude of 20.04 should be transformed
			expect(startLonLat[0]).not.toBe(DEFAULTS.lon);
			expect(startLonLat[1]).not.toBe(DEFAULTS.lat);

			// Should be reasonable Mercator values
			expect(startLonLat[0]).toBeGreaterThan(1000000);
			expect(startLonLat[1]).toBeGreaterThan(1000000);
		});
	});

	describe('map configuration', () => {
		it('map has controls by default', () => {
			const map = createMap(mapContainer);
			const controls = map.getControls();

			// OpenLayers includes default controls (zoom, attribution)
			expect(controls.getLength()).toBeGreaterThan(0);
			map.dispose();
		});

		it('view has correct projection', () => {
			const map = createMap(mapContainer);
			const view = map.getView();
			const projection = view.getProjection();

			expect(projection.getCode()).toBe('EPSG:3857'); // Web Mercator
			map.dispose();
		});

		it('can be called multiple times to create independent maps', () => {
			const container1 = document.createElement('div');
			const container2 = document.createElement('div');
			document.body.appendChild(container1);
			document.body.appendChild(container2);

			const map1 = createMap(container1);
			const map2 = createMap(container2);

			expect(map1).not.toBe(map2);
			expect(map1.getTarget()).toBe(container1);
			expect(map2.getTarget()).toBe(container2);

			map1.dispose();
			map2.dispose();
			document.body.removeChild(container1);
			document.body.removeChild(container2);
		});
	});

	describe('parameter validation', () => {
		it('handles zero zoom level', () => {
			const map = createMap(mapContainer, 0);
			const view = map.getView();

			expect(view.getZoom()).toBe(0);
			map.dispose();
		});

		it('handles high zoom level', () => {
			const map = createMap(mapContainer, 20);
			const view = map.getView();

			expect(view.getZoom()).toBe(20);
			map.dispose();
		});

		it('handles center at [0, 0]', () => {
			const zeroCenter = fromLonLat([0, 0]);
			const map = createMap(mapContainer, DEFAULTS.zoom, zeroCenter);
			const view = map.getView();

			expect(view.getCenter()).toEqual(zeroCenter);
			map.dispose();
		});

		it('handles negative coordinates', () => {
			const negativeCenter = fromLonLat([-74.0, 40.7]); // New York
			const map = createMap(mapContainer, DEFAULTS.zoom, negativeCenter);
			const view = map.getView();

			expect(view.getCenter()).toEqual(negativeCenter);
			map.dispose();
		});
	});
});
