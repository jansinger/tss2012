<script lang="ts">
	import type { Coordinates } from '$lib/types';
	import type { Map } from 'ol';

	let { coordinates = [0, 0] as Coordinates } = $props();

	let mapElement: HTMLElement;
	let map: Map | undefined;

	// Combined effect with proper cleanup using return function
	$effect(() => {
		if (!mapElement) return;

		let currentMap: Map | undefined;

		import('$lib/ol/overviewmap').then(({ createOverviewMap }) => {
			currentMap = createOverviewMap(mapElement, coordinates);
			currentMap.updateSize();
			map = currentMap;
		});

		// Cleanup function runs before effect re-runs or on unmount
		return () => {
			if (currentMap) {
				currentMap.setTarget(undefined);
				currentMap.dispose();
			}
			map = undefined;
		};
	});
</script>

<div class="map" bind:this={mapElement} data-testid="map-element"></div>
