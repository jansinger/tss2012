<script type="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Map } from 'ol';
	import { createTooltipOverlay } from '$lib/ol/overlays/tooltip';

	const dispatch = createEventDispatcher();

	let map: Map;
	let mapElement: HTMLElement, tooltipElement: HTMLElement;

	onMount(async () => {
		const { createMap } = await import('$lib/ol/map');
		map = createMap(mapElement);
		createTooltipOverlay(tooltipElement, map);
		// @ts-ignore: Argument not assignable
		map.on('clickLogbook', (e) => dispatch('clickLogbook', e));
	});
</script>

<div class="tooltip" bind:this={tooltipElement}>
	<time>&nbsp;</time>
	<address>&nbsp;</address>
	<h1>&nbsp;</h1>
</div>

<div class="map" bind:this={mapElement}>
	<img
		src="pics/banner.png"
		class="logo"
		alt="Ein tierischer Segelsommer"
		title="Ein tierischer Segelsommer"
	/>
</div>

<style lang="scss">
	@import 'ol/ol.css';

	:global(body) {
		height: 100%;
	}

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
	}

	.map :global(.ol-overlaycontainer),
	.map :global(.ol-overlaycontainer-stopevent) {
		z-index: 10 !important;
	}

	.logo {
		position: absolute;
		bottom: 0px;
		left: 0px;
		z-index: 1;
		width: 50%;
		min-width: 300px;
		background-position: center center;
		border-top-right-radius: 16px;
		box-shadow: 0 1px 8px rgba(255, 255, 255, 0.4);
	}

	:global(.tooltip) {
		display: inline-block;
		position: absolute;
		border-bottom: 1px dotted #666;
		text-align: left;
		z-index: 5;
	}

	.tooltip :global(h3) {
		margin: 12px 0;
	}

	.tooltip :global(.right) {
		min-width: 200px;
		max-width: 400px;
		top: 50%;
		left: 100%;
		margin-left: 20px;
		transform: translate(0, -50%);
		padding: 0;
		color: #efefef;
		background-color: #666666;
		font-weight: normal;
		font-size: 13px;
		border-radius: 8px;
		position: absolute;
		z-index: 10;
		box-sizing: border-box;
		box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
	}

	.tooltip :global(.right) :global(img) {
		width: 200px;
		border-radius: 8px 8px 0 0;
	}
	.tooltip :global(.text-content) {
		padding: 10px 10px;
	}

	.tooltip :global(address) {
		font-size: 0.8em;
	}

	.tooltip :global(.right) :global(i) {
		position: absolute;
		top: 50%;
		right: 100%;
		margin-top: -12px;
		width: 12px;
		height: 24px;
		overflow: hidden;
	}
	.tooltip :global(.right) :global(i::after) {
		content: '';
		position: absolute;
		width: 12px;
		height: 12px;
		left: 0;
		top: 50%;
		transform: translate(50%, -50%) rotate(-45deg);
		background-color: #444444;
		box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
	}
</style>
