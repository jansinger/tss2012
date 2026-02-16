import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('createDebouncedNavigation', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should navigate on first call', async () => {
		const { goto } = await import('$app/navigation');
		const { createDebouncedNavigation } = await import('./navigation');

		const nav = createDebouncedNavigation(1000);
		nav.navigate('/log/1');

		expect(goto).toHaveBeenCalledWith('/log/1');
		nav.cleanup();
	});

	it('should block rapid successive navigations', async () => {
		const { goto } = await import('$app/navigation');
		const { createDebouncedNavigation } = await import('./navigation');

		const nav = createDebouncedNavigation(1000);
		nav.navigate('/log/1');
		nav.navigate('/log/2');
		nav.navigate('/log/3');

		expect(goto).toHaveBeenCalledTimes(1);
		expect(goto).toHaveBeenCalledWith('/log/1');
		nav.cleanup();
	});

	it('should allow navigation after delay expires', async () => {
		const { goto } = await import('$app/navigation');
		const { createDebouncedNavigation } = await import('./navigation');

		const nav = createDebouncedNavigation(500);
		nav.navigate('/log/1');

		vi.advanceTimersByTime(500);

		nav.navigate('/log/2');

		expect(goto).toHaveBeenCalledTimes(2);
		expect(goto).toHaveBeenLastCalledWith('/log/2');
		nav.cleanup();
	});

	it('should still be blocked before delay expires', async () => {
		const { goto } = await import('$app/navigation');
		const { createDebouncedNavigation } = await import('./navigation');

		const nav = createDebouncedNavigation(500);
		nav.navigate('/log/1');

		vi.advanceTimersByTime(499);

		nav.navigate('/log/2');

		expect(goto).toHaveBeenCalledTimes(1);
		nav.cleanup();
	});

	it('should reset blocked state on cleanup', async () => {
		const { goto } = await import('$app/navigation');
		const { createDebouncedNavigation } = await import('./navigation');

		const nav = createDebouncedNavigation(1000);
		nav.navigate('/log/1');

		// Cleanup resets blocked state
		nav.cleanup();

		nav.navigate('/log/2');

		expect(goto).toHaveBeenCalledTimes(2);
		expect(goto).toHaveBeenLastCalledWith('/log/2');
	});

	it('should clear timeout on cleanup', async () => {
		const { createDebouncedNavigation } = await import('./navigation');

		const nav = createDebouncedNavigation(1000);
		nav.navigate('/test');

		// Cleanup should clear the timeout
		nav.cleanup();

		// Advancing time should not cause any issues
		vi.advanceTimersByTime(2000);
	});

	it('should handle cleanup when no navigation has occurred', async () => {
		const { createDebouncedNavigation } = await import('./navigation');

		const nav = createDebouncedNavigation(1000);
		// Cleanup without any navigation should not throw
		expect(() => nav.cleanup()).not.toThrow();
	});
});
