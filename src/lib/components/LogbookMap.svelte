<script type="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Map, Overlay } from 'ol';
	import { createTooltipOverlay } from '$lib/ol/overlays/tooltip';

	const dispatch = createEventDispatcher();

	let map: Map;
	let mapElement: HTMLElement, tooltipElement: HTMLElement, tooltip: Overlay;

	onMount(async () => {
		const { createMap } = await import('$lib/ol/map');
		map = createMap(mapElement);
		tooltip = createTooltipOverlay(tooltipElement, map);
		// @ts-ignore: Argument not assignable
		map.on('clickLogbook', (e) => dispatch('clickLogbook', e));
	});
</script>

<div class="map" bind:this={mapElement} />
<div class="tooltip" bind:this={tooltipElement} />

<style lang="scss">
	@import 'ol/ol.css';

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
	}

	/* Tooltip text */
	.tooltip {
		width: 120px;
		background-color: gray;
		color: #fff;
		text-align: center;
		padding: 5px;
		border-radius: 6px;

		/* Position the tooltip text - see examples below! */
		position: absolute;
		z-index: 1;
		font-size: 0.8em;
	}
</style>
