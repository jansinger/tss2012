import { describe, it, expect, beforeEach } from 'vitest';
import { logbook, markerStyle } from './logbook';
import { createMockOLFeature } from '../../../tests/test-utils';
import type { Style } from 'ol/style';

describe('logbook layer - Integration Tests', () => {
	describe('Layer Creation', () => {
		it('should create a vector layer', () => {
			const layer = logbook();

			expect(layer).toBeDefined();
			expect(layer.constructor.name).toBe('VectorLayer');
		});

		it('should have cluster source configured', () => {
			const layer = logbook();
			const source = layer.getSource();

			expect(source).toBeDefined();
			expect(source?.constructor.name).toBe('Cluster');
		});

		it('should configure cluster with correct distance', () => {
			const layer = logbook();
			const source = layer.getSource();

			// Cluster source should have distance configured
			expect((source as any).getDistance()).toBe(50);
		});

		it('should configure cluster with minDistance', () => {
			const layer = logbook();
			const source = layer.getSource();

			expect((source as any).getMinDistance()).toBe(20);
		});

		it('should have GeoJSON source with correct URL', () => {
			const layer = logbook();
			const clusterSource = layer.getSource();
			const vectorSource = (clusterSource as any).source;

			expect(vectorSource.constructor.name).toBe('VectorSource');
			// URL is set in loader
			expect(vectorSource.loader_).toBeDefined();
		});

		it('should have style function configured', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle();

			expect(typeof styleFunc).toBe('function');
		});

		it('should have name property set to logbook', () => {
			const layer = logbook();

			expect(layer.get('name')).toBe('logbook');
		});
	});

	describe('Style Function - Single Feature', () => {
		it('should return marker style for single feature', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle() as Function;

			const feature = createMockOLFeature({
				features: [createMockOLFeature()]
			});

			const style = styleFunc(feature);

			expect(style).toBe(markerStyle);
		});

		it('should use icon for single feature', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle() as Function;

			const feature = createMockOLFeature({
				features: [createMockOLFeature()]
			});

			const style = styleFunc(feature) as Style;
			const image = style.getImage();

			expect(image).toBeDefined();
			expect(image?.constructor.name).toBe('Icon');
		});

		it('should configure icon with correct src', () => {
			const style = markerStyle;
			const image = style.getImage() as any;

			expect(image.getSrc()).toBe('/pics/marker-tss.svg');
		});

		it('should configure icon scale', () => {
			const style = markerStyle;
			const image = style.getImage() as any;

			expect(image.getScale()).toBe(0.4);
		});

		it('should configure icon anchor', () => {
			const style = markerStyle;
			const image = style.getImage() as any;

			const anchor = image.getAnchor();
			expect(anchor).toBeDefined();
		});
	});

	describe('Style Function - Cluster (2-9 features)', () => {
		it('should return circle style for cluster of 2 features', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle() as Function;

			const feature = createMockOLFeature({
				features: [createMockOLFeature(), createMockOLFeature()]
			});

			const style = styleFunc(feature) as Style;
			const image = style.getImage();

			expect(image).toBeDefined();
			expect(image?.constructor.name).toBe('CircleStyle');
		});

		it('should show count text for cluster', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle() as Function;

			const feature = createMockOLFeature({
				features: Array(5)
					.fill(null)
					.map(() => createMockOLFeature())
			});

			const style = styleFunc(feature) as Style;
			const text = style.getText();

			expect(text).toBeDefined();
			expect(text?.getText()).toBe('5');
		});

		it('should use white text color', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle() as Function;

			const feature = createMockOLFeature({
				features: Array(3)
					.fill(null)
					.map(() => createMockOLFeature())
			});

			const style = styleFunc(feature) as Style;
			const text = style.getText();
			const fill = text?.getFill();

			expect(fill?.getColor()).toBe('#fff');
		});

		it('should use blue circle background', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle() as Function;

			const feature = createMockOLFeature({
				features: Array(3)
					.fill(null)
					.map(() => createMockOLFeature())
			});

			const style = styleFunc(feature) as Style;
			const image = style.getImage() as any;
			const fill = image.getFill();

			expect(fill?.getColor()).toBe('#2e6287');
		});

		it('should use white circle stroke', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle() as Function;

			const feature = createMockOLFeature({
				features: Array(3)
					.fill(null)
					.map(() => createMockOLFeature())
			});

			const style = styleFunc(feature) as Style;
			const image = style.getImage() as any;
			const stroke = image.getStroke();

			expect(stroke?.getColor()).toBe('#fff');
		});
	});

	describe('Style Function - Large Clusters', () => {
		it('should handle cluster of 10 features', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle() as Function;

			const feature = createMockOLFeature({
				features: Array(10)
					.fill(null)
					.map(() => createMockOLFeature())
			});

			const style = styleFunc(feature) as Style;
			const text = style.getText();

			expect(text?.getText()).toBe('10');
		});

		it('should handle cluster of 99 features', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle() as Function;

			const feature = createMockOLFeature({
				features: Array(99)
					.fill(null)
					.map(() => createMockOLFeature())
			});

			const style = styleFunc(feature) as Style;
			const text = style.getText();

			expect(text?.getText()).toBe('99');
		});

		it('should handle cluster of 100+ features', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle() as Function;

			const feature = createMockOLFeature({
				features: Array(150)
					.fill(null)
					.map(() => createMockOLFeature())
			});

			const style = styleFunc(feature) as Style;
			const text = style.getText();

			expect(text?.getText()).toBe('150');
		});
	});

	describe('Style Caching', () => {
		it('should cache style for same cluster size', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle() as Function;

			const feature1 = createMockOLFeature({
				features: Array(5)
					.fill(null)
					.map(() => createMockOLFeature())
			});

			const feature2 = createMockOLFeature({
				features: Array(5)
					.fill(null)
					.map(() => createMockOLFeature())
			});

			const style1 = styleFunc(feature1);
			const style2 = styleFunc(feature2);

			// Should return same cached instance
			expect(style1).toBe(style2);
		});

		it('should return different styles for different cluster sizes', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle() as Function;

			const feature3 = createMockOLFeature({
				features: Array(3)
					.fill(null)
					.map(() => createMockOLFeature())
			});

			const feature5 = createMockOLFeature({
				features: Array(5)
					.fill(null)
					.map(() => createMockOLFeature())
			});

			const style3 = styleFunc(feature3);
			const style5 = styleFunc(feature5);

			// Different sizes should have different styles
			expect(style3).not.toBe(style5);
		});

		it('should cache single feature style', () => {
			const layer = logbook();
			const styleFunc = layer.getStyle() as Function;

			const feature1 = createMockOLFeature({
				features: [createMockOLFeature()]
			});

			const feature2 = createMockOLFeature({
				features: [createMockOLFeature()]
			});

			const style1 = styleFunc(feature1);
			const style2 = styleFunc(feature2);

			// Single features should all use the same markerStyle
			expect(style1).toBe(style2);
			expect(style1).toBe(markerStyle);
		});
	});

	describe('Layer Independence', () => {
		it('should create independent layers on each call', () => {
			const layer1 = logbook();
			const layer2 = logbook();

			expect(layer1).not.toBe(layer2);
		});

		it('should have independent sources', () => {
			const layer1 = logbook();
			const layer2 = logbook();

			const source1 = layer1.getSource();
			const source2 = layer2.getSource();

			expect(source1).not.toBe(source2);
		});

		it('should share style cache across layers', () => {
			const layer1 = logbook();
			const layer2 = logbook();

			const styleFunc1 = layer1.getStyle() as Function;
			const styleFunc2 = layer2.getStyle() as Function;

			const feature = createMockOLFeature({
				features: Array(7)
					.fill(null)
					.map(() => createMockOLFeature())
			});

			const style1 = styleFunc1(feature);
			const style2 = styleFunc2(feature);

			// Should use same cached style
			expect(style1).toBe(style2);
		});
	});
});
