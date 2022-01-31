<script type="ts">
	import { afterUpdate, beforeUpdate } from 'svelte';
	import type { Map } from 'ol';

	export let coordinates: number[] = [0, 0];

	let mapElement: HTMLElement;
	let map: Map;

	beforeUpdate(() => {
		map && map.setTarget(null);
		map = undefined;
	});

	afterUpdate(async () => {
		const { createOverviewMap } = await import('$lib/ol/overviewmap');
		map = createOverviewMap(mapElement, coordinates);
	});
</script>

<div class="map" bind:this={mapElement} />
