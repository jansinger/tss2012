import { assert, describe, it, vi, expect } from 'vitest';
import { getFeatureAtEventPixel } from './getFeatureAtEventPixel';

import { Map, Overlay, Feature } from 'ol';
import { Point } from 'ol/geom';
import { createTooltipOverlay } from './tooltip';
// At the top of your test file
global.ResizeObserver = class ResizeObserver {
	observe() {
		// Do nothing
	}
	unobserve() {
		// Do nothing
	}
	disconnect() {
		// Do nothing
	}
};

// Your tests go here
describe('getFeatureAtEventPixel', () => {
	it('returns the feature at the event pixel', () => {
		const mockMap = {
			getEventPixel: vi.fn(),
			getFeaturesAtPixel: vi.fn()
		};
		const mockEvent = { originalEvent: new Event('click') };
		const mockFeature = {}; // Mock feature object

		mockMap.getEventPixel.mockReturnValue([0, 0]);
		mockMap.getFeaturesAtPixel.mockReturnValue([mockFeature]);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const feature = getFeatureAtEventPixel(mockEvent as any, mockMap as any);
		assert.strictEqual(feature, mockFeature);
	});

	it('returns undefined when no feature is at the pixel', () => {
		const mockMap = {
			getEventPixel: vi.fn(),
			getFeaturesAtPixel: vi.fn()
		};
		const mockEvent = { originalEvent: new Event('click') };

		mockMap.getEventPixel.mockReturnValue([100, 200]);
		mockMap.getFeaturesAtPixel.mockReturnValue([]);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const feature = getFeatureAtEventPixel(mockEvent as any, mockMap as any);
		expect(feature).toBeUndefined();
	});

	it('filters features by logbook layer', () => {
		const mockMap = {
			getEventPixel: vi.fn(),
			getFeaturesAtPixel: vi.fn()
		};
		const mockEvent = { originalEvent: new Event('click') };
		const mockFeature = new Feature(new Point([0, 0]));

		mockMap.getEventPixel.mockReturnValue([50, 50]);
		mockMap.getFeaturesAtPixel.mockReturnValue([mockFeature]);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getFeatureAtEventPixel(mockEvent as any, mockMap as any);

		// Verify layerFilter was passed
		expect(mockMap.getFeaturesAtPixel).toHaveBeenCalledWith(
			[50, 50],
			expect.objectContaining({
				layerFilter: expect.any(Function)
			})
		);
	});

	it('returns first feature when multiple features are at the same pixel', () => {
		const mockMap = {
			getEventPixel: vi.fn(),
			getFeaturesAtPixel: vi.fn()
		};
		const mockEvent = { originalEvent: new Event('click') };
		const mockFeature1 = new Feature(new Point([0, 0]));
		const mockFeature2 = new Feature(new Point([0, 0]));

		mockMap.getEventPixel.mockReturnValue([50, 50]);
		mockMap.getFeaturesAtPixel.mockReturnValue([mockFeature1, mockFeature2]);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const feature = getFeatureAtEventPixel(mockEvent as any, mockMap as any);

		expect(feature).toBe(mockFeature1);
	});

	it('correctly extracts pixel from different event types', () => {
		const mockMap = {
			getEventPixel: vi.fn(),
			getFeaturesAtPixel: vi.fn()
		};
		const mouseEvent = new MouseEvent('click', { clientX: 123, clientY: 456 });
		const mockEvent = { originalEvent: mouseEvent };

		mockMap.getEventPixel.mockReturnValue([123, 456]);
		mockMap.getFeaturesAtPixel.mockReturnValue([]);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getFeatureAtEventPixel(mockEvent as any, mockMap as any);

		expect(mockMap.getEventPixel).toHaveBeenCalledWith(mouseEvent);
	});
});

describe('createTooltipOverlay', () => {
	it('creates an overlay', () => {
		const mockElement = document.createElement('div');
		const mockMap = new Map();

		const overlay = createTooltipOverlay(mockElement, mockMap);
		assert.instanceOf(overlay, Overlay);
	});
});
