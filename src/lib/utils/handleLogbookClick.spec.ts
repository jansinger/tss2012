import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppState } from '$lib/AppState.svelte';
import { createMockOLFeature, createMockLogEntry } from '../../tests/test-utils';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('handleLogbookClick', () => {
	beforeEach(() => {
		AppState.currentEntries = [];
		vi.clearAllMocks();
	});

	it('should navigate to entry page for single feature', async () => {
		const { goto } = await import('$app/navigation');
		const { handleLogbookClick } = await import('./handleLogbookClick');

		const innerFeature = createMockOLFeature({ id: 'entry-42' });
		const clusterFeature = createMockOLFeature({ features: [innerFeature] });

		handleLogbookClick(clusterFeature as any);

		expect(goto).toHaveBeenCalledWith('/log/entry-42');
		expect(AppState.currentEntries).toEqual([]);
	});

	it('should update AppState for cluster with multiple features', async () => {
		const { goto } = await import('$app/navigation');
		const { handleLogbookClick } = await import('./handleLogbookClick');

		const entry1 = createMockLogEntry({ _id: 'e1', title: 'Entry 1' });
		const entry2 = createMockLogEntry({ _id: 'e2', title: 'Entry 2' });
		const feature1 = createMockOLFeature(entry1);
		const feature2 = createMockOLFeature(entry2);
		const clusterFeature = createMockOLFeature({ features: [feature1, feature2] });

		handleLogbookClick(clusterFeature as any);

		expect(goto).not.toHaveBeenCalled();
		expect(AppState.currentEntries).toHaveLength(2);
		expect(AppState.currentEntries[0]).toMatchObject({ _id: 'e1', title: 'Entry 1' });
		expect(AppState.currentEntries[1]).toMatchObject({ _id: 'e2', title: 'Entry 2' });
	});

	it('should handle cluster with many features', async () => {
		const { handleLogbookClick } = await import('./handleLogbookClick');

		const features = Array.from({ length: 10 }, (_, i) =>
			createMockOLFeature(createMockLogEntry({ _id: `entry-${i}` }))
		);
		const clusterFeature = createMockOLFeature({ features });

		handleLogbookClick(clusterFeature as any);

		expect(AppState.currentEntries).toHaveLength(10);
	});
});
