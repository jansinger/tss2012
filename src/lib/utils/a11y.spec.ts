import { describe, it, expect, vi, afterEach } from 'vitest';
import { prefersReducedMotion } from './a11y';

describe('prefersReducedMotion', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns false when matchMedia is not available', () => {
		vi.stubGlobal('window', { matchMedia: undefined });
		expect(prefersReducedMotion()).toBe(false);
	});

	it('returns true when user prefers reduced motion', () => {
		vi.stubGlobal('window', {
			matchMedia: vi.fn().mockReturnValue({ matches: true })
		});
		expect(prefersReducedMotion()).toBe(true);
	});

	it('returns false when user does not prefer reduced motion', () => {
		vi.stubGlobal('window', {
			matchMedia: vi.fn().mockReturnValue({ matches: false })
		});
		expect(prefersReducedMotion()).toBe(false);
	});

	it('queries the correct media feature', () => {
		const matchMediaMock = vi.fn().mockReturnValue({ matches: false });
		vi.stubGlobal('window', { matchMedia: matchMediaMock });
		prefersReducedMotion();
		expect(matchMediaMock).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
	});
});
