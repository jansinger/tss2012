import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppState } from '$lib/AppState.svelte';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('appStateHelpers', () => {
	beforeEach(() => {
		AppState.currentEntries = [];
		vi.clearAllMocks();
	});

	describe('clearCurrentEntries', () => {
		it('should clear currentEntries array', async () => {
			AppState.currentEntries = [
				{ _id: '1', title: 'Test', section: 'A', datetime: '2012-01-01', pictureFolder: '' }
			];

			const { clearCurrentEntries } = await import('./appStateHelpers');
			clearCurrentEntries();

			expect(AppState.currentEntries).toEqual([]);
		});

		it('should work when entries are already empty', async () => {
			const { clearCurrentEntries } = await import('./appStateHelpers');
			clearCurrentEntries();

			expect(AppState.currentEntries).toEqual([]);
		});
	});

	describe('closeAndNavigateHome', () => {
		it('should clear entries and navigate to home', async () => {
			const { goto } = await import('$app/navigation');
			AppState.currentEntries = [
				{ _id: '1', title: 'Test', section: 'A', datetime: '2012-01-01', pictureFolder: '' }
			];

			const { closeAndNavigateHome } = await import('./appStateHelpers');
			closeAndNavigateHome();

			expect(AppState.currentEntries).toEqual([]);
			expect(goto).toHaveBeenCalledWith('/');
		});

		it('should navigate to home even when entries are empty', async () => {
			const { goto } = await import('$app/navigation');
			const { closeAndNavigateHome } = await import('./appStateHelpers');
			closeAndNavigateHome();

			expect(goto).toHaveBeenCalledWith('/');
		});
	});
});
