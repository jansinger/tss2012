import { goto } from '$app/navigation';
import { AppState } from '$lib/AppState.svelte';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';
import type { LogEntryShort } from '$lib/types';

/**
 * Maps an OpenLayers feature to a LogEntryShort object.
 * @param feature - The OpenLayers feature to extract properties from
 * @returns The feature properties as LogEntryShort
 */
const mapFeatureToEntry = (feature: Feature<Geometry>): LogEntryShort =>
	feature.getProperties() as LogEntryShort;

/**
 * Handles click events on logbook markers in the map.
 * - Single feature: Navigates directly to the log entry page
 * - Multiple features (cluster): Updates AppState with all entries for overlay display
 *
 * @param feature - The clicked feature (may contain clustered features)
 */
export function handleLogbookClick(feature: Feature): void {
	const features = feature.get('features');
	if (features.length === 1) {
		goto(`/log/${features[0].get('id')}`);
	} else {
		AppState.currentEntries = features.map(mapFeatureToEntry);
	}
}
