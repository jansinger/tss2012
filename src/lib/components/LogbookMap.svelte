<script lang="ts" module>
	import { map } from '$lib/stores';
</script>

<script lang="ts">
    import { createTooltipOverlay } from '$lib/ol/overlays/tooltip';
    import { fade } from 'svelte/transition';
	import { AppState } from '$lib/AppState.svelte';
	import type { Feature } from 'ol';
	import type { Geometry } from 'ol/geom';
	import type { LogEntryShort } from '$lib/types';
	import { goto } from '$app/navigation';

    let mapElement: HTMLElement, tooltipElement: HTMLElement;

	const mapFeatures = (feature: Feature<Geometry>): LogEntryShort =>
		feature.getProperties() as LogEntryShort;

	// Add proper type for the click event
	type LogbookClickEvent = {
		feature: Feature;
	}

	const clickLogbook = (feature: Feature) => {
		const features = feature.get('features');
		if (features.length === 1) {
			goto(`/log/${features[0].get('id')}`);
		} else {
			AppState.currentEntries = features.map(mapFeatures);
		}
	}

	/**
     * Initializes and sets up the map when the component is mounted.
     *
     * This function performs the following tasks:
     * 1. Creates a new map if it doesn't exist
     * 2. Sets up a tooltip overlay for the map
     * 3. Sets the target element and updates size
     * 4. Adds event listeners after map is fully initialized
     **/
	const initMap = async () => {
        try {
            // Return early if map already exists
            if ($map) {
                $map.setTarget(mapElement);
                $map.updateSize();
                return;
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
            createTooltipOverlay(tooltipElement, newMap);

            // Set in store before adding listeners
            map.set(newMap);

            // Add event listener after map is fully initialized
            $map.on('clickLogbook', (e: LogbookClickEvent) => clickLogbook(e.feature));

        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }

    // Run effect when component mounts and elements are available
    $: {
        if (mapElement && tooltipElement) {
            initMap();
        }
    }
</script>

<div class="tooltip" bind:this={tooltipElement} transition:fade data-testid="tooltip">
	<time>&nbsp;</time>
	<address>&nbsp;</address>
	<h3>Huch! Keine Überschrift...</h3>
</div>

<div class="map" bind:this={mapElement} data-testid="map" role="application" aria-label="Interaktive Karte der Segelreise">
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
		max-width: 500px;
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

	:global(.tooltip .right) {
		min-width: 200px;
		max-width: 400px;
		top: 50%;
		left: 100%;
		margin-left: 20px;
		transform: translate(0, -50%);
		padding: 0;
		border-radius: 8px;
		position: absolute;
		z-index: 10;
		
		// Consolidated image styles
		img {
			width: 200px;
			border-radius: 8px 8px 0 0;
			filter: brightness(0.9) contrast(1.2);
		}

		// Consolidated arrow styles
		i {
			position: absolute;
			top: 50%;
			right: 100%;
			margin-top: -12px;
			width: 12px;
			height: 24px;
			overflow: hidden;

			&::after {
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
		}
	}

	.tooltip :global(.text-content) {
		padding: 10px 10px;
	}

	.tooltip :global(address) {
		font-size: 0.75rem;
	}
</style>
