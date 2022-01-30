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
		const { createOverviewMap } = await import('$lib/ol/minimap');
		map = createOverviewMap(mapElement, coordinates);
	});
</script>

<div class="map" bind:this={mapElement} />

<style lang="scss">
	.map {
		width: 200px;
		height: 200px;
		-moz-border-radius: 15px;
		border-radius: 15px;
		overflow: hidden;
	}
</style>
