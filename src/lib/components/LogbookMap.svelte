<script type="ts" context="module">
	import { map } from '$lib/stores';
</script>

<script type="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { createTooltipOverlay } from '$lib/ol/overlays/tooltip';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	let mapElement: HTMLElement, tooltipElement: HTMLElement;

	onMount(async () => {
		if (!$map) {
			const { createMap } = await import('$lib/ol/map');
			map.set(createMap(mapElement));
			createTooltipOverlay(tooltipElement, $map);
			// @ts-ignore: Argument not assignable
			$map.on('clickLogbook', (e) => dispatch('clickLogbook', e));
		}
		$map.setTarget(mapElement);
		// ensure all tiles are loaded
		$map.updateSize();
	});
</script>

<div class="tooltip" bind:this={tooltipElement} transition:fade>
	<time>&nbsp;</time>
	<address>&nbsp;</address>
	<h1>&nbsp;</h1>
</div>

<div class="map" bind:this={mapElement}>
	<img
		src="/pics/banner.png"
		class="logo"
		alt="Ein tierischer Segelsommer"
		title="Ein tierischer Segelsommer"
	/>
</div>

<style lang="scss">
	.map {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.map :global(.ol-overlaycontainer),
	.map :global(.ol-overlaycontainer-stopevent) {
		z-index: 2 !important;
	}

	.logo {
		position: absolute;
		bottom: 0px;
		left: 0px;
		z-index: 1;
		width: 35%;
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
		font-size: 1rem;
	}

	.tooltip :global(.right) {
		min-width: 200px;
		max-width: 400px;
		top: 50%;
		left: 100%;
		margin-left: 20px;
		transform: translate(0, -50%);
		padding: 0;
		//color: #efefef;
		//background-color: #2e6287;
		font-weight: normal;
		font-size: 13px;
		border-radius: 8px;
		position: absolute;
		z-index: 10;
		//box-sizing: border-box;
		//box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
	}

	.tooltip :global(.right) :global(img) {
		width: 200px;
		border-radius: 8px 8px 0 0;
		filter: brightness(0.9) contrast(1.2);
	}
	.tooltip :global(.text-content) {
		padding: 10px 10px;
	}

	.tooltip :global(address) {
		font-size: 0.75rem;
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
