<script lang="ts" module>
	import { map } from '$lib/stores';
</script>

<script lang="ts">
	import { createTooltipOverlay, type TooltipOverlayResult } from '$lib/ol/overlays/tooltip';
	import { fade } from 'svelte/transition';
	import { prefersReducedMotion } from '$lib/utils/a11y';
	import { type LogbookClickEvent, onLogbookClick } from '$lib/types';
	import { handleLogbookClick as handleClick } from '$lib/utils/handleLogbookClick';

	let mapElement: HTMLElement;
	let tooltipElement: HTMLElement;
	let tooltipResult: TooltipOverlayResult | null = null;

	const handleLogbookClickEvent = (e: LogbookClickEvent) => handleClick(e.feature);

	/**
	 * Initializes and sets up the map when the component is mounted.
	 *
	 * This function performs the following tasks:
	 * 1. Creates a new map if it doesn't exist
	 * 2. Sets up a tooltip overlay for the map
	 * 3. Sets the target element and updates size
	 * 4. Adds event listeners after map is fully initialized
	 *
	 * @returns A cleanup function to remove event listeners
	 **/
	const initMap = async (): Promise<(() => void) | undefined> => {
		try {
			// Return early if map already exists
			if ($map) {
				$map.setTarget(mapElement);
				$map.updateSize();

				// Re-attach event listener using type-safe helper and return cleanup
				const unsubscribe = onLogbookClick($map, handleLogbookClickEvent);
				return unsubscribe;
			}

			// Ensure both elements are available
			if (!mapElement || !tooltipElement) {
				return;
			}

			const { createMap } = await import('$lib/ol/map');
			const newMap = createMap(mapElement);

			// Update size after map creation
			newMap.updateSize();

			// Then create overlay and add event listeners
			tooltipResult = createTooltipOverlay(tooltipElement, newMap);

			// Set in store before adding listeners
			map.set(newMap);

			// Add event listener using type-safe helper
			const unsubscribe = onLogbookClick(newMap, handleLogbookClickEvent);

			// Return cleanup function
			return () => {
				unsubscribe();
				tooltipResult?.cleanup();
				tooltipResult = null;
			};
		} catch (error) {
			console.error('Error initializing map:', error);
		}
	};

	// Run effect when component mounts and elements are available (Svelte 5)
	$effect(() => {
		if (!mapElement || !tooltipElement) return;

		let cleanup: (() => void) | undefined;

		initMap().then((cleanupFn) => {
			cleanup = cleanupFn;
		});

		return () => {
			cleanup?.();
		};
	});
</script>

<div class="tooltip" bind:this={tooltipElement} transition:fade={{ duration: prefersReducedMotion() ? 0 : 400 }} data-testid="tooltip">
	<time>&nbsp;</time>
	<address>&nbsp;</address>
	<h3>Huch! Keine Überschrift...</h3>
</div>

<div class="map" bind:this={mapElement} data-testid="map" role="region" aria-label="Interaktive Karte der Segelreise">
	<img
		src="/pics/banner_small.png"
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

	// OL overlay z-index overrides — required due to OpenLayers specificity
	.map :global(.ol-overlaycontainer),
	.map :global(.ol-overlaycontainer-stopevent) {
		z-index: var(--z-map-overlays) !important;
	}

	.logo {
		position: absolute;
		bottom: 0px;
		left: 0px;
		z-index: 1;
		width: 35%;
		min-width: 300px;
		max-width: 500px;
		background-position: center center;
		border-top-right-radius: 16px;
		box-shadow: var(--shadow-logo);
	}

	:global(.tooltip) {
		display: inline-block;
		position: absolute;
		border-bottom: 1px dotted #666;
		text-align: left;
		z-index: var(--z-navigation);
	}

	.tooltip :global(h3) {
		margin: var(--space-3) 0;
		font-size: var(--font-size-md);
	}

	:global(.tooltip .right) {
		min-width: 200px;
		max-width: 400px;
		top: 50%;
		left: 100%;
		margin-left: var(--space-5);
		transform: translate(0, -50%);
		padding: 0;
		border-radius: var(--radius-xl);
		position: absolute;
		z-index: var(--z-map-tooltip);

		// Consolidated image styles
		img {
			width: 200px;
			border-radius: var(--radius-xl) var(--radius-xl) 0 0;
			filter: brightness(0.9) contrast(1.2);
		}
	}

	// Arrow styles for dynamically generated tooltip content (from createTooltipHTML.ts)
	:global(.tooltip .right i) {
		position: absolute;
		top: 50%;
		right: 100%;
		margin-top: -12px;
		width: 12px;
		height: 24px;
		overflow: hidden;
	}

	:global(.tooltip .right i::after) {
		content: '';
		position: absolute;
		width: 12px;
		height: 12px;
		left: 0;
		top: 50%;
		transform: translate(50%, -50%) rotate(-45deg);
		background-color: var(--color-surface-tooltip, #444444);
		box-shadow: var(--shadow-tooltip);
	}

	.tooltip :global(.text-content) {
		padding: var(--space-2-5);
	}

	.tooltip :global(address) {
		font-size: var(--font-size-xs);
	}
</style>
