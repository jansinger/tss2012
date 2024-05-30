<script lang="ts">
	import { afterUpdate, beforeUpdate } from 'svelte';
	import type { Map } from 'ol';

	export let coordinates: number[] = [0, 0];

	let mapElement: HTMLElement;
	let map: Map;

	beforeUpdate(() => {
		map?.setTarget(null);
		map?.dispose();
		map = undefined;
	});

	afterUpdate(async () => {
		const { createOverviewMap } = await import('$lib/ol/overviewmap');
		map = createOverviewMap(mapElement, coordinates);
		map.updateSize();
	});
</script>

<div class="map" bind:this={mapElement} data-testid="map-element" />
