/**
 * Checks if the user prefers reduced motion via OS/browser settings.
 * Use this to conditionally disable Svelte transitions.
 *
 * @example
 * ```svelte
 * <div transition:fly={{ duration: prefersReducedMotion() ? 0 : 300 }}>
 * ```
 */
export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined' || !window.matchMedia) {
		return false;
	}
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
