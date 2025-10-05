import type { LogEntryShort } from './types';

/**
 * Global application state managed with Svelte 5 runes
 */
export const AppState = $state<{
	currentEntries: LogEntryShort[];
}>({
	currentEntries: []
});