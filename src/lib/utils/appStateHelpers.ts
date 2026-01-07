import { goto } from '$app/navigation';
import { AppState } from '$lib/AppState.svelte';

/**
 * Clears the current entries from the app state.
 * Centralized function to avoid DRY violations across components.
 */
export function clearCurrentEntries(): void {
	AppState.currentEntries = [];
}

/**
 * Closes the current view and navigates to the home page.
 * Combines clearing state with navigation for consistent behavior.
 */
export function closeAndNavigateHome(): void {
	clearCurrentEntries();
	goto('/');
}
