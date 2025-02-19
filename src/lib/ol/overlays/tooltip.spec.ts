import { assert, describe, it, vi } from 'vitest';
import { getFeatureAtEventPixel } from './getFeatureAtEventPixel';

import { Map, Overlay } from 'ol';
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
});

describe('createTooltipOverlay', () => {
	it('creates an overlay', () => {
		const mockElement = document.createElement('div');
		const mockMap = new Map();

		const overlay = createTooltipOverlay(mockElement, mockMap);
		assert.instanceOf(overlay, Overlay);
	});
});
