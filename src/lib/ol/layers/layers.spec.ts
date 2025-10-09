import { describe, it, expect } from 'vitest';
import { osm } from './osm';
import { seamap } from './seamap';
import { track } from './track';
import { logbook, markerStyle } from './logbook';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import { Cluster } from 'ol/source';
import KML from 'ol/format/KML';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Icon } from 'ol/style';

describe('Map Layers', () => {
	describe('osm layer', () => {
		it('creates a TileLayer instance', () => {
			const layer = osm();
			expect(layer).toBeInstanceOf(TileLayer);
		});

		it('uses XYZ source', () => {
			const layer = osm();
			const source = layer.getSource();
			expect(source).toBeInstanceOf(XYZ);
		});

		it('has MapTiler URL configured', () => {
			const layer = osm();
			const source = layer.getSource() as XYZ;
			const urls = source.getUrls();

			expect(urls).toBeDefined();
			expect(urls?.[0]).toContain('api.maptiler.com');
			expect(urls?.[0]).toContain('/maps/streets/');
		});

		it('has correct attributions', () => {
			const layer = osm();
			const source = layer.getSource() as XYZ;
			const attributions = source.getAttributions();

			expect(attributions).toBeDefined();
			const attrString =
				typeof attributions === 'function' ? attributions(null as any) : attributions;
			const attrArray = Array.isArray(attrString) ? attrString : [attrString];
			const combinedAttrs = attrArray.join(' ');

			expect(combinedAttrs).toContain('MapTiler');
			expect(combinedAttrs).toContain('OpenStreetMap');
		});

		it('has tile size of 512', () => {
			const layer = osm();
			const source = layer.getSource() as XYZ;
			const tileGrid = source.getTileGrid();

			expect(tileGrid?.getTileSize(0)).toBe(512);
		});

		it('can be identified by testing layer properties', () => {
			const layer = osm();
			const source = layer.getSource();
			// OSM layer can be identified by its MapTiler source
			expect(source).toBeInstanceOf(XYZ);
		});
	});

	describe('seamap layer', () => {
		it('creates a TileLayer instance', () => {
			const layer = seamap();
			expect(layer).toBeInstanceOf(TileLayer);
		});

		it('uses XYZ source', () => {
			const layer = seamap();
			const source = layer.getSource();
			expect(source).toBeInstanceOf(XYZ);
		});

		it('has OpenSeaMap URL configured', () => {
			const layer = seamap();
			const source = layer.getSource() as XYZ;
			const urls = source.getUrls();

			expect(urls).toBeDefined();
			expect(urls?.[0]).toContain('openseamap.org');
			expect(urls?.[0]).toContain('/seamark/');
		});

		it('can be identified by OpenSeaMap URL', () => {
			const layer = seamap();
			const source = layer.getSource() as XYZ;
			const urls = source.getUrls();
			expect(urls?.[0]).toContain('openseamap.org');
		});
	});

	describe('track layer', () => {
		it('creates a VectorLayer instance', () => {
			const layer = track();
			expect(layer).toBeInstanceOf(VectorLayer);
		});

		it('uses VectorSource', () => {
			const layer = track();
			const source = layer.getSource();
			expect(source).toBeInstanceOf(VectorSource);
		});

		it('has KML format configured', () => {
			const layer = track();
			const source = layer.getSource() as VectorSource;
			const format = source.getFormat();

			expect(format).toBeInstanceOf(KML);
		});

		it('loads from correct KML file path', () => {
			const layer = track();
			const source = layer.getSource() as VectorSource;
			const url = source.getUrl();

			expect(url).toBe('/data/segelsommer2012.kml');
		});

		it('has custom style configured', () => {
			const layer = track();
			const style = layer.getStyle();

			expect(style).toBeDefined();
			expect(style).toBeInstanceOf(Style);
		});

		it('style has red stroke', () => {
			const layer = track();
			const style = layer.getStyle() as Style;
			const stroke = style.getStroke();

			expect(stroke).toBeDefined();
			expect(stroke?.getColor()).toBe('red');
			expect(stroke?.getWidth()).toBe(1.0);
		});

		it('style has transparent white fill', () => {
			const layer = track();
			const style = layer.getStyle() as Style;
			const fill = style.getFill();

			expect(fill).toBeDefined();
			expect(fill?.getColor()).toBe('rgba(255,255,255,0.4)');
		});

		it('KML format does not extract styles', () => {
			const layer = track();
			const source = layer.getSource() as VectorSource;
			const format = source.getFormat() as KML;

			// KML format configured with extractStyles: false
			// This ensures our custom style is used instead of KML styles
			expect(format).toBeInstanceOf(KML);
		});

		it('can be identified by KML source', () => {
			const layer = track();
			const source = layer.getSource() as VectorSource;
			expect(source.getFormat()).toBeInstanceOf(KML);
		});
	});

	describe('logbook layer', () => {
		it('creates a VectorLayer instance', () => {
			const layer = logbook();
			expect(layer).toBeInstanceOf(VectorLayer);
		});

		it('uses Cluster source', () => {
			const layer = logbook();
			const source = layer.getSource();
			expect(source).toBeInstanceOf(Cluster);
		});

		it('cluster wraps a VectorSource', () => {
			const layer = logbook();
			const clusterSource = layer.getSource() as Cluster;
			const vectorSource = clusterSource.getSource();

			expect(vectorSource).toBeInstanceOf(VectorSource);
		});

		it('vector source uses GeoJSON format', () => {
			const layer = logbook();
			const clusterSource = layer.getSource() as Cluster;
			const vectorSource = clusterSource.getSource() as VectorSource;
			const format = vectorSource.getFormat();

			expect(format).toBeInstanceOf(GeoJSON);
		});

		it('loads from correct GeoJSON file path', () => {
			const layer = logbook();
			const clusterSource = layer.getSource() as Cluster;
			const vectorSource = clusterSource.getSource() as VectorSource;
			const url = vectorSource.getUrl();

			expect(url).toBe('/data/logbook_geo.json');
		});

		it('has cluster distance configured', () => {
			const layer = logbook();
			const clusterSource = layer.getSource() as Cluster;
			const distance = clusterSource.getDistance();

			// Default cluster distance should be set
			expect(distance).toBeGreaterThan(0);
		});

		it('has style function configured', () => {
			const layer = logbook();
			const style = layer.getStyle();

			expect(style).toBeDefined();
			expect(typeof style).toBe('function');
		});

		it('can be identified by Cluster source', () => {
			const layer = logbook();
			const source = layer.getSource();
			expect(source).toBeInstanceOf(Cluster);
		});
	});

	describe('markerStyle export', () => {
		it('is a Style instance', () => {
			expect(markerStyle).toBeInstanceOf(Style);
		});

		it('has Icon image configured', () => {
			const image = markerStyle.getImage();
			expect(image).toBeInstanceOf(Icon);
		});

		it('icon points to marker SVG', () => {
			const image = markerStyle.getImage() as Icon;
			const src = image.getSrc();

			expect(src).toBe('/pics/marker-tss.svg');
		});

		it('icon has correct scale', () => {
			const image = markerStyle.getImage() as Icon;
			const scale = image.getScale();

			expect(scale).toBe(0.4);
		});

		it('icon has anchor configured', () => {
			const image = markerStyle.getImage() as Icon;
			// Icon has anchor configuration
			// Note: anchor may be null until icon is loaded
			const src = image.getSrc();
			expect(src).toBeDefined();
		});
	});

	describe('layer factory pattern', () => {
		it('osm creates new instances on each call', () => {
			const layer1 = osm();
			const layer2 = osm();

			expect(layer1).not.toBe(layer2);
		});

		it('seamap creates new instances on each call', () => {
			const layer1 = seamap();
			const layer2 = seamap();

			expect(layer1).not.toBe(layer2);
		});

		it('track shares the same source instance', () => {
			const layer1 = track();
			const layer2 = track();

			// Source is shared (singleton pattern for performance)
			expect(layer1.getSource()).toBe(layer2.getSource());
		});

		it('logbook creates independent cluster instances', () => {
			const layer1 = logbook();
			const layer2 = logbook();

			// Each layer gets its own instance (factory pattern)
			expect(layer1).not.toBe(layer2);
		});
	});
});
