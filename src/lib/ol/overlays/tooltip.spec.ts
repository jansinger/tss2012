import { assert, describe, it, vi } from 'vitest';
import { getFeatureAtEventPixel, createTooltipOverlay } from './tooltip';
import { Map, Overlay } from 'ol';
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
      getFeaturesAtPixel: vi.fn(),
    };
    const mockEvent = { originalEvent: new Event('click') };
    const mockFeature = {}; // Mock feature object

    mockMap.getEventPixel.mockReturnValue([0, 0]);
    mockMap.getFeaturesAtPixel.mockReturnValue([mockFeature]);

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