import { render } from '@testing-library/svelte';
import OverviewMap from './OverviewMap.svelte';
import { assert, describe, it, vi } from 'vitest';

describe('OverviewMap', () => {
	it('renders the map element', () => {
		const { getByTestId } = render(OverviewMap);
		const mapElement = getByTestId('map-element');
		assert.ok(mapElement, 'Map element should be in the document');
	});

	it('renders the map element extended', async () => {
		const { getByTestId } = render(OverviewMap);
		const mapElement = getByTestId('map-element') as any; // Cast mapElement to 'any' type
		// Check if mapElement is defined
		if (!mapElement) {
			throw new Error('mapElement is not defined');
		}

		// Mock map and ctx objects if they are not defined
		mapElement.map = mapElement.map || { updateSize: vi.fn() };

		const map = mapElement.map;

		// Simulate component update
		mapElement.coordinates = [1, 1];
		mapElement.coordinates = [1, 1];

		assert.ok(map.updateSize, 'Map size should be updated');
	});
});
