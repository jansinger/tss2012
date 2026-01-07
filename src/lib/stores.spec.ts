import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { map } from './stores';
import type { Map } from 'ol';

// Mock OpenLayers Map
const createMockMap = (id: string = 'test-map'): Partial<Map> => ({
	setTarget: vi.fn(),
	getTarget: vi.fn().mockReturnValue(null),
	updateSize: vi.fn(),
	dispose: vi.fn(),
	addLayer: vi.fn(),
	removeLayer: vi.fn(),
	addOverlay: vi.fn(),
	removeOverlay: vi.fn(),
	on: vi.fn(),
	un: vi.fn(),
	getView: vi.fn().mockReturnValue({
		getCenter: vi.fn().mockReturnValue([0, 0]),
		getZoom: vi.fn().mockReturnValue(8),
		setCenter: vi.fn(),
		setZoom: vi.fn()
	}),
	getLayers: vi.fn().mockReturnValue({
		getLength: vi.fn().mockReturnValue(0),
		getArray: vi.fn().mockReturnValue([])
	}),
	// Add a custom property for identification in tests
	get: vi.fn().mockReturnValue(id)
});

describe('stores', () => {
	beforeEach(() => {
		// Reset the store to undefined before each test
		map.set(undefined as unknown as Map);
	});

	describe('map store', () => {
		describe('initialization', () => {
			it('should be undefined initially', () => {
				const currentMap = get(map);
				expect(currentMap).toBeUndefined();
			});

			it('should be a writable store', () => {
				expect(map).toHaveProperty('subscribe');
				expect(map).toHaveProperty('set');
				expect(map).toHaveProperty('update');
			});
		});

		describe('set', () => {
			it('should store a map instance', () => {
				const mockMap = createMockMap() as Map;
				map.set(mockMap);

				const currentMap = get(map);
				expect(currentMap).toBe(mockMap);
			});

			it('should allow setting to undefined', () => {
				const mockMap = createMockMap() as Map;
				map.set(mockMap);
				expect(get(map)).toBe(mockMap);

				map.set(undefined as unknown as Map);
				expect(get(map)).toBeUndefined();
			});

			it('should replace existing map with new one', () => {
				const firstMap = createMockMap('first') as Map;
				const secondMap = createMockMap('second') as Map;

				map.set(firstMap);
				expect(get(map)).toBe(firstMap);

				map.set(secondMap);
				expect(get(map)).toBe(secondMap);
				expect(get(map)).not.toBe(firstMap);
			});
		});

		describe('update', () => {
			it('should update map using update function', () => {
				const mockMap = createMockMap() as Map;

				map.update(() => mockMap);

				expect(get(map)).toBe(mockMap);
			});

			it('should receive current value in update callback', () => {
				const firstMap = createMockMap('first') as Map;
				map.set(firstMap);

				let receivedValue: Map | undefined;
				map.update((current) => {
					receivedValue = current;
					return current;
				});

				expect(receivedValue).toBe(firstMap);
			});
		});

		describe('subscribe', () => {
			it('should call subscriber immediately with current value', () => {
				const subscriber = vi.fn();
				const unsubscribe = map.subscribe(subscriber);

				expect(subscriber).toHaveBeenCalledTimes(1);
				expect(subscriber).toHaveBeenCalledWith(undefined);

				unsubscribe();
			});

			it('should notify subscribers when value changes', () => {
				const subscriber = vi.fn();
				const unsubscribe = map.subscribe(subscriber);

				const mockMap = createMockMap() as Map;
				map.set(mockMap);

				expect(subscriber).toHaveBeenCalledTimes(2);
				expect(subscriber).toHaveBeenLastCalledWith(mockMap);

				unsubscribe();
			});

			it('should support multiple subscribers', () => {
				const subscriber1 = vi.fn();
				const subscriber2 = vi.fn();

				const unsubscribe1 = map.subscribe(subscriber1);
				const unsubscribe2 = map.subscribe(subscriber2);

				const mockMap = createMockMap() as Map;
				map.set(mockMap);

				expect(subscriber1).toHaveBeenLastCalledWith(mockMap);
				expect(subscriber2).toHaveBeenLastCalledWith(mockMap);

				unsubscribe1();
				unsubscribe2();
			});

			it('should not notify after unsubscribe', () => {
				const subscriber = vi.fn();
				const unsubscribe = map.subscribe(subscriber);

				expect(subscriber).toHaveBeenCalledTimes(1);

				unsubscribe();

				const mockMap = createMockMap() as Map;
				map.set(mockMap);

				// Should not be called again after unsubscribe
				expect(subscriber).toHaveBeenCalledTimes(1);
			});

			it('should return unsubscribe function', () => {
				const unsubscribe = map.subscribe(() => {});
				expect(typeof unsubscribe).toBe('function');
				unsubscribe();
			});
		});

		describe('edge cases', () => {
			it('should handle rapid successive updates', () => {
				const subscriber = vi.fn();
				const unsubscribe = map.subscribe(subscriber);

				const maps = Array.from({ length: 10 }, (_, i) => createMockMap(`map-${i}`) as Map);

				maps.forEach((m) => map.set(m));

				// Initial call + 10 updates
				expect(subscriber).toHaveBeenCalledTimes(11);
				expect(get(map)).toBe(maps[9]);

				unsubscribe();
			});

			it('should handle setting same map instance twice', () => {
				const subscriber = vi.fn();
				const mockMap = createMockMap() as Map;

				const unsubscribe = map.subscribe(subscriber);
				map.set(mockMap);
				map.set(mockMap);

				// Svelte stores notify on every set, even with same value
				expect(subscriber).toHaveBeenCalledTimes(3);

				unsubscribe();
			});
		});
	});

	describe('integration with OpenLayers Map API', () => {
		it('should allow calling map methods after retrieval', () => {
			const mockMap = createMockMap() as Map;
			map.set(mockMap);

			const currentMap = get(map);
			currentMap?.setTarget(document.createElement('div'));

			expect(mockMap.setTarget).toHaveBeenCalled();
		});

		it('should preserve map reference through store operations', () => {
			const mockMap = createMockMap() as Map;
			const targetElement = document.createElement('div');

			map.set(mockMap);

			// Simulate operations that might happen in components
			const map1 = get(map);
			map1?.setTarget(targetElement);

			const map2 = get(map);
			map2?.updateSize();

			// Both should be the same instance
			expect(map1).toBe(map2);
			expect(mockMap.setTarget).toHaveBeenCalledWith(targetElement);
			expect(mockMap.updateSize).toHaveBeenCalled();
		});
	});
});
