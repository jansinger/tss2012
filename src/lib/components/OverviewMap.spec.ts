import { render, cleanup, waitFor } from '@testing-library/svelte';
import OverviewMap from './OverviewMap.svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock map instance - created fresh for each test
const createMockMap = () => ({
	updateSize: vi.fn(),
	setTarget: vi.fn(),
	dispose: vi.fn()
});

let mockMap: ReturnType<typeof createMockMap>;

// Mock the overviewmap module with dynamic mock map
vi.mock('$lib/ol/overviewmap', () => {
	return {
		createOverviewMap: vi.fn((element, coords) => {
			// Use the mockMap from the outer scope
			return mockMap;
		})
	};
});

describe('OverviewMap', () => {
	beforeEach(async () => {
		mockMap = createMockMap();
		// Reset the mock implementation for each test
		const { createOverviewMap } = await import('$lib/ol/overviewmap');
		vi.mocked(createOverviewMap).mockImplementation(() => mockMap);
		vi.clearAllMocks();
	});

	afterEach(async () => {
		// Ensure all pending promises are resolved before cleanup
		await vi.waitFor(() => {}, { timeout: 50 }).catch(() => {});
		cleanup();
	});

	describe('DOM rendering', () => {
		it('renders the map element', () => {
			const { getByTestId } = render(OverviewMap);
			const mapElement = getByTestId('map-element');
			expect(mapElement).toBeTruthy();
		});

		it('renders map element with correct class', () => {
			const { getByTestId } = render(OverviewMap);
			const mapElement = getByTestId('map-element');
			expect(mapElement.classList.contains('map')).toBe(true);
		});
	});

	describe('map initialization', () => {
		it('calls createOverviewMap with element and coordinates', async () => {
			const { createOverviewMap } = await import('$lib/ol/overviewmap');
			const coordinates = [10.5, 54.5];

			render(OverviewMap, { coordinates });

			await vi.waitFor(() => {
				expect(createOverviewMap).toHaveBeenCalled();
			});

			const callArgs = vi.mocked(createOverviewMap).mock.calls[0];
			expect(callArgs[0]).toBeInstanceOf(HTMLElement);
			expect(callArgs[1]).toEqual(coordinates);
		});

		it('calls updateSize after map creation', async () => {
			render(OverviewMap, { coordinates: [10, 54] });

			await vi.waitFor(() => {
				expect(mockMap.updateSize).toHaveBeenCalled();
			});
		});

		it('uses default coordinates when not provided', async () => {
			const { createOverviewMap } = await import('$lib/ol/overviewmap');

			render(OverviewMap);

			await vi.waitFor(() => {
				expect(createOverviewMap).toHaveBeenCalled();
			});

			const callArgs = vi.mocked(createOverviewMap).mock.calls[0];
			expect(callArgs[1]).toEqual([0, 0]);
		});
	});

	describe('cleanup on unmount', () => {
		it('calls setTarget(null) when component unmounts', async () => {
			const { unmount } = render(OverviewMap, { coordinates: [10, 54] });

			// Wait for map to be initialized
			await vi.waitFor(() => {
				expect(mockMap.updateSize).toHaveBeenCalled();
			});

			unmount();

			expect(mockMap.setTarget).toHaveBeenCalledWith(null);
		});

		it('calls dispose when component unmounts', async () => {
			const { unmount } = render(OverviewMap, { coordinates: [10, 54] });

			// Wait for map to be initialized
			await vi.waitFor(() => {
				expect(mockMap.updateSize).toHaveBeenCalled();
			});

			unmount();

			expect(mockMap.dispose).toHaveBeenCalled();
		});

		it('cleanup is called in correct order: setTarget then dispose', async () => {
			const callOrder: string[] = [];
			mockMap.setTarget = vi.fn(() => callOrder.push('setTarget'));
			mockMap.dispose = vi.fn(() => callOrder.push('dispose'));

			const { unmount } = render(OverviewMap, { coordinates: [10, 54] });

			await vi.waitFor(() => {
				expect(mockMap.updateSize).toHaveBeenCalled();
			});

			unmount();

			expect(callOrder).toEqual(['setTarget', 'dispose']);
		});
	});

	describe('coordinates prop', () => {
		it('accepts different coordinate values', async () => {
			const { createOverviewMap } = await import('$lib/ol/overviewmap');
			const coordinates = [12.5, 55.0];

			render(OverviewMap, { coordinates });

			await vi.waitFor(() => {
				expect(createOverviewMap).toHaveBeenCalled();
			});

			const callArgs = vi.mocked(createOverviewMap).mock.calls[0];
			expect(callArgs[1]).toEqual(coordinates);
		});
	});
});
