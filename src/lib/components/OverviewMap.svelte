<script lang="ts">
	import type { Coordinates } from '$lib/types';
	import type { Map } from 'ol';

	let { coordinates = [0, 0] as Coordinates } = $props();

	let mapElement: HTMLElement;
	let map: Map;

	$effect.pre(() => {
		map?.setTarget(null);
		map?.dispose();
		map = undefined;
	});

	$effect(() => {
		import('$lib/ol/overviewmap').then(({createOverviewMap}) => {
			map = createOverviewMap(mapElement, coordinates);
			map.updateSize();
		})
	});
</script>

<div class="map" bind:this={mapElement} data-testid="map-element"></div>
