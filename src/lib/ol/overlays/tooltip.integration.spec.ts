import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTooltipOverlay } from './tooltip';
import { createMockOLMap, createMockOLFeature, createMockLogEntry } from '../../../tests/test-utils';
import type { MapBrowserEvent } from 'ol';

// Mock dependencies
vi.mock('./createTooltipHTML', () => ({
	createTooltipHTML: vi.fn((feature: any) => {
		return `<div class="tooltip-content">
			<h3>${feature.title}</h3>
			<time>${feature.localeDatetime}</time>
			<address>${feature.section}</address>
		</div>`;
	})
}));

vi.mock('./getFeatureAtEventPixel', () => ({
	getFeatureAtEventPixel: vi.fn()
}));

describe('tooltip - Integration Tests', () => {
	let mockMap: any;
	let tooltipElement: HTMLElement;
	let mockGetFeatureAtEventPixel: any;
	let mockCreateTooltipHTML: any;

	beforeEach(async () => {
		mockMap = createMockOLMap();
		mockMap.getTargetElement = vi.fn(() => ({
			style: { cursor: '' }
		}));

		tooltipElement = document.createElement('div');
		tooltipElement.className = 'tooltip';
		document.body.appendChild(tooltipElement);

		const getFeatureModule = await import('./getFeatureAtEventPixel');
		const tooltipHTMLModule = await import('./createTooltipHTML');
		mockGetFeatureAtEventPixel = getFeatureModule.getFeatureAtEventPixel as any;
		mockCreateTooltipHTML = tooltipHTMLModule.createTooltipHTML as any;
	});

	afterEach(() => {
		if (tooltipElement && tooltipElement.parentNode) {
			tooltipElement.parentNode.removeChild(tooltipElement);
		}
		vi.clearAllMocks();
	});

	describe('Overlay Creation', () => {
		it('should create overlay and add to map', () => {
			const overlay = createTooltipOverlay(tooltipElement, mockMap);

			expect(overlay).toBeDefined();
			expect(mockMap.addOverlay).toHaveBeenCalledWith(overlay);
		});

		it('should set up click event listener', () => {
			createTooltipOverlay(tooltipElement, mockMap);

			expect(mockMap.on).toHaveBeenCalledWith('click', expect.any(Function));
		});

		it('should set up pointermove event listener', () => {
			createTooltipOverlay(tooltipElement, mockMap);

			expect(mockMap.on).toHaveBeenCalledWith('pointermove', expect.any(Function));
		});

		it('should configure overlay with correct options', () => {
			const overlay = createTooltipOverlay(tooltipElement, mockMap);

			// Overlay should have element set
			expect(overlay.getElement()).toBe(tooltipElement);
		});
	});

	describe('Tooltip Display on Hover', () => {
		it('should show tooltip when hovering over single feature', () => {
			const entry = createMockLogEntry({
				_id: 'entry-1',
				title: 'Test Entry',
				section: 'Test Section',
				localeDatetime: '15.07.2012'
			});
			const feature = createMockOLFeature(entry);
			const clusterFeature = createMockOLFeature({ features: [feature] });

			mockGetFeatureAtEventPixel.mockReturnValue(clusterFeature);

			const overlay = createTooltipOverlay(tooltipElement, mockMap);

			// Simulate pointermove event
			const event = {
				coordinate: [1000, 2000],
				pixel: [100, 200]
			} as MapBrowserEvent<UIEvent>;

			const pointerMoveHandler = mockMap._listeners['pointermove'][0];
			pointerMoveHandler(event);

			// Tooltip should be positioned
			expect(overlay.getPosition()).toEqual([1000, 2000]);

			// Tooltip HTML should be set
			expect(tooltipElement.innerHTML).toContain('Test Entry');
			expect(tooltipElement.innerHTML).toContain('Test Section');
		});

		it('should set cursor to pointer on hover', () => {
			const feature = createMockOLFeature({ features: [createMockOLFeature()] });
			mockGetFeatureAtEventPixel.mockReturnValue(feature);

			const targetElement = { style: { cursor: '' } };
			mockMap.getTargetElement.mockReturnValue(targetElement);

			createTooltipOverlay(tooltipElement, mockMap);

			const event = {
				coordinate: [1000, 2000],
				pixel: [100, 200]
			} as MapBrowserEvent<UIEvent>;

			const pointerMoveHandler = mockMap._listeners['pointermove'][0];
			pointerMoveHandler(event);

			expect(targetElement.style.cursor).toBe('pointer');
		});

		it('should hide tooltip when moving away from feature', () => {
			const feature = createMockOLFeature({ features: [createMockOLFeature()] });

			// First hover over feature
			mockGetFeatureAtEventPixel.mockReturnValue(feature);

			const targetElement = { style: { cursor: 'pointer' } };
			mockMap.getTargetElement.mockReturnValue(targetElement);

			const overlay = createTooltipOverlay(tooltipElement, mockMap);

			const event1 = {
				coordinate: [1000, 2000],
				pixel: [100, 200]
			} as MapBrowserEvent<UIEvent>;

			const pointerMoveHandler = mockMap._listeners['pointermove'][0];
			pointerMoveHandler(event1);

			expect(overlay.getPosition()).toBeDefined();

			// Then move away (no feature)
			mockGetFeatureAtEventPixel.mockReturnValue(null);

			const event2 = {
				coordinate: [1100, 2100],
				pixel: [110, 210]
			} as MapBrowserEvent<UIEvent>;

			pointerMoveHandler(event2);

			// Tooltip should be hidden
			expect(overlay.getPosition()).toBeUndefined();
			expect(targetElement.style.cursor).toBe('');
		});

		it('should not show tooltip for cluster with multiple features', () => {
			const feature1 = createMockOLFeature();
			const feature2 = createMockOLFeature();
			const clusterFeature = createMockOLFeature({
				features: [feature1, feature2]
			});

			mockGetFeatureAtEventPixel.mockReturnValue(clusterFeature);

			const overlay = createTooltipOverlay(tooltipElement, mockMap);

			const event = {
				coordinate: [1000, 2000],
				pixel: [100, 200]
			} as MapBrowserEvent<UIEvent>;

			const pointerMoveHandler = mockMap._listeners['pointermove'][0];
			pointerMoveHandler(event);

			// Tooltip should NOT be shown for clusters
			expect(overlay.getPosition()).toBeUndefined();
		});
	});

	describe('Tooltip Caching', () => {
		it('should cache tooltip HTML for same feature', () => {
			const entry = createMockLogEntry({ _id: 'entry-1' });
			const feature = createMockOLFeature(entry);
			const clusterFeature = createMockOLFeature({ features: [feature] });

			mockGetFeatureAtEventPixel.mockReturnValue(clusterFeature);
			mockCreateTooltipHTML.mockClear();

			createTooltipOverlay(tooltipElement, mockMap);

			const event = {
				coordinate: [1000, 2000],
				pixel: [100, 200]
			} as MapBrowserEvent<UIEvent>;

			const pointerMoveHandler = mockMap._listeners['pointermove'][0];

			// First hover
			pointerMoveHandler(event);
			expect(mockCreateTooltipHTML).toHaveBeenCalledTimes(1);

			// Move away
			mockGetFeatureAtEventPixel.mockReturnValue(null);
			pointerMoveHandler(event);

			// Hover again over same feature
			mockGetFeatureAtEventPixel.mockReturnValue(clusterFeature);
			pointerMoveHandler(event);

			// Should use cached HTML
			expect(mockCreateTooltipHTML).toHaveBeenCalledTimes(1);
		});

		it('should generate new HTML for different feature', () => {
			const entry1 = createMockLogEntry({ _id: 'entry-1' });
			const entry2 = createMockLogEntry({ _id: 'entry-2' });

			const feature1 = createMockOLFeature(entry1);
			const feature2 = createMockOLFeature(entry2);

			const cluster1 = createMockOLFeature({ features: [feature1] });
			const cluster2 = createMockOLFeature({ features: [feature2] });

			mockCreateTooltipHTML.mockClear();

			createTooltipOverlay(tooltipElement, mockMap);

			const event = {
				coordinate: [1000, 2000],
				pixel: [100, 200]
			} as MapBrowserEvent<UIEvent>;

			const pointerMoveHandler = mockMap._listeners['pointermove'][0];

			// Hover over first feature
			mockGetFeatureAtEventPixel.mockReturnValue(cluster1);
			pointerMoveHandler(event);
			expect(mockCreateTooltipHTML).toHaveBeenCalledTimes(1);

			// Hover over second feature
			mockGetFeatureAtEventPixel.mockReturnValue(cluster2);
			pointerMoveHandler(event);
			expect(mockCreateTooltipHTML).toHaveBeenCalledTimes(2);
		});
	});

	describe('Click Handling', () => {
		it('should dispatch clickLogbook event on feature click', () => {
			const feature = createMockOLFeature({ features: [createMockOLFeature()] });
			mockGetFeatureAtEventPixel.mockReturnValue(feature);

			createTooltipOverlay(tooltipElement, mockMap);

			const event = {
				coordinate: [1000, 2000],
				pixel: [100, 200]
			} as MapBrowserEvent<UIEvent>;

			const clickHandler = mockMap._listeners['click'][0];
			clickHandler(event);

			expect(mockMap.dispatchEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'clickLogbook',
					feature: feature
				})
			);
		});

		it('should hide tooltip after click', () => {
			const feature = createMockOLFeature({ features: [createMockOLFeature()] });
			mockGetFeatureAtEventPixel.mockReturnValue(feature);

			const targetElement = { style: { cursor: 'pointer' } };
			mockMap.getTargetElement.mockReturnValue(targetElement);

			const overlay = createTooltipOverlay(tooltipElement, mockMap);

			// Show tooltip first
			const event = {
				coordinate: [1000, 2000],
				pixel: [100, 200]
			} as MapBrowserEvent<UIEvent>;

			const pointerMoveHandler = mockMap._listeners['pointermove'][0];
			pointerMoveHandler(event);

			expect(overlay.getPosition()).toBeDefined();

			// Click
			const clickHandler = mockMap._listeners['click'][0];
			clickHandler(event);

			// Tooltip should be hidden
			expect(overlay.getPosition()).toBeUndefined();
			expect(targetElement.style.cursor).toBe('');
		});

		it('should not dispatch event when clicking empty area', () => {
			mockGetFeatureAtEventPixel.mockReturnValue(null);

			createTooltipOverlay(tooltipElement, mockMap);

			const event = {
				coordinate: [1000, 2000],
				pixel: [100, 200]
			} as MapBrowserEvent<UIEvent>;

			mockMap.dispatchEvent.mockClear();

			const clickHandler = mockMap._listeners['click'][0];
			clickHandler(event);

			expect(mockMap.dispatchEvent).not.toHaveBeenCalled();
		});
	});

	describe('Tooltip Positioning', () => {
		it('should update tooltip position when hovering over same feature', () => {
			const feature = createMockOLFeature({ features: [createMockOLFeature()] });
			mockGetFeatureAtEventPixel.mockReturnValue(feature);

			const overlay = createTooltipOverlay(tooltipElement, mockMap);

			const event1 = {
				coordinate: [1000, 2000],
				pixel: [100, 200]
			} as MapBrowserEvent<UIEvent>;

			const pointerMoveHandler = mockMap._listeners['pointermove'][0];
			pointerMoveHandler(event1);

			expect(overlay.getPosition()).toEqual([1000, 2000]);

			// Move mouse while still over feature
			const event2 = {
				coordinate: [1100, 2100],
				pixel: [110, 210]
			} as MapBrowserEvent<UIEvent>;

			pointerMoveHandler(event2);

			expect(overlay.getPosition()).toEqual([1100, 2100]);
		});

		it('should show tooltip for new feature when switching', () => {
			const entry1 = createMockLogEntry({ _id: 'entry-1', title: 'Entry 1' });
			const entry2 = createMockLogEntry({ _id: 'entry-2', title: 'Entry 2' });

			const feature1 = createMockOLFeature(entry1);
			const feature2 = createMockOLFeature(entry2);

			const cluster1 = createMockOLFeature({ features: [feature1] });
			const cluster2 = createMockOLFeature({ features: [feature2] });

			const overlay = createTooltipOverlay(tooltipElement, mockMap);

			const event = {
				coordinate: [1000, 2000],
				pixel: [100, 200]
			} as MapBrowserEvent<UIEvent>;

			const pointerMoveHandler = mockMap._listeners['pointermove'][0];

			// Hover over first feature
			mockGetFeatureAtEventPixel.mockReturnValue(cluster1);
			pointerMoveHandler(event);

			expect(tooltipElement.innerHTML).toContain('Entry 1');

			// Move to second feature
			mockGetFeatureAtEventPixel.mockReturnValue(cluster2);
			pointerMoveHandler(event);

			expect(tooltipElement.innerHTML).toContain('Entry 2');
		});
	});

	describe('Edge Cases', () => {
		it('should handle feature without id', () => {
			const entry = createMockLogEntry();
			delete (entry as any)._id;

			const feature = createMockOLFeature(entry);
			const clusterFeature = createMockOLFeature({ features: [feature] });

			mockGetFeatureAtEventPixel.mockReturnValue(clusterFeature);

			const overlay = createTooltipOverlay(tooltipElement, mockMap);

			const event = {
				coordinate: [1000, 2000],
				pixel: [100, 200]
			} as MapBrowserEvent<UIEvent>;

			const pointerMoveHandler = mockMap._listeners['pointermove'][0];

			// Should not crash
			expect(() => pointerMoveHandler(event)).not.toThrow();
			expect(overlay.getPosition()).toBeDefined();
		});

		it('should handle empty features array', () => {
			const clusterFeature = createMockOLFeature({ features: [] });
			mockGetFeatureAtEventPixel.mockReturnValue(clusterFeature);

			const overlay = createTooltipOverlay(tooltipElement, mockMap);

			const event = {
				coordinate: [1000, 2000],
				pixel: [100, 200]
			} as MapBrowserEvent<UIEvent>;

			const pointerMoveHandler = mockMap._listeners['pointermove'][0];

			expect(() => pointerMoveHandler(event)).not.toThrow();
			// Should not show tooltip for empty cluster
			expect(overlay.getPosition()).toBeUndefined();
		});
	});
});
