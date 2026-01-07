import { goto } from '$app/navigation';

/**
 * Result object from createDebouncedNavigation with navigation and cleanup functions.
 */
export interface DebouncedNavigation {
	/** Navigate to a path with debounce protection */
	navigate: (path: string) => void;
	/** Cleanup function to clear any pending timeouts - MUST be called on component unmount */
	cleanup: () => void;
}

/**
 * Creates a debounced navigation handler that prevents rapid successive navigations.
 * Returns both a navigate function and a cleanup function that MUST be called
 * when the component unmounts to prevent memory leaks.
 *
 * @param delayMs - Debounce delay in milliseconds
 * @returns Object with navigate and cleanup functions
 *
 * @example
 * ```typescript
 * const wheelNav = createDebouncedNavigation(1000);
 * const keyboardNav = createDebouncedNavigation(300);
 *
 * $effect(() => {
 *     return () => {
 *         wheelNav.cleanup();
 *         keyboardNav.cleanup();
 *     };
 * });
 * ```
 */
export function createDebouncedNavigation(delayMs: number): DebouncedNavigation {
	let blocked = false;
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	return {
		navigate(path: string): void {
			if (blocked) return;
			blocked = true;
			goto(path);
			timeoutId = setTimeout(() => (blocked = false), delayMs);
		},
		cleanup(): void {
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = undefined;
			}
			blocked = false;
		}
	};
}
