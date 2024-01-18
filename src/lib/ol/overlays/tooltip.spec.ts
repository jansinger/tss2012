import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTooltipOverlay, getFeatureAtEventPixel } from './tooltip';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import Feature from 'ol/Feature';

// Mocking OpenLayers classes
vi.mock('ol/Map', () => ({
  Map: vi.fn(),
  getEventPixel: vi.fn(),
  getFeaturesAtPixel: vi.fn(),
  addOverlay: vi.fn(),
  on: vi.fn(),
  getTargetElement: vi.fn(),
  dispatchEvent: vi.fn(),
}));
vi.mock('ol/Overlay', () => ({
  Overlay: vi.fn(),
}));

describe('getFeatureAtEventPixel', () => {
  it('retrieves the correct feature', () => {
    const mockMap = new Map();
    const mockEvent = /* create a mock MapBrowserEvent */;
    const mockFeature = new Feature();

    mockMap.getFeaturesAtPixel.mockReturnValue([mockFeature]);

    const feature = getFeatureAtEventPixel(mockEvent, mockMap);
    expect(feature).toBe(mockFeature);
  });
});

describe('createTooltipOverlay', () => {
  let mockMap, mockElement, overlay;

  beforeEach(() => {
    mockMap = new Map();
    mockElement = document.createElement('div');
    overlay = createTooltipOverlay(mockElement, mockMap);
  });

  it('creates an overlay', () => {
    expect(Overlay).toHaveBeenCalledWith({
      element: mockElement,
      // ... other properties
    });
  });

  // Additional tests for event handling and DOM manipulation
});
