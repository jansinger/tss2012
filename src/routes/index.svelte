<script type="ts" context="module">
	export const prerender = true;
</script>

<script type="ts">
	import { goto } from '$app/navigation';
	import LogbookEntries from '$lib/components/LogbookEntries.svelte';
	import Overlay from '$lib/components/Overlay.svelte';
	import { getContext } from 'svelte';
	import type { Feature } from 'ol';
	import type Geometry from 'ol/geom/Geometry';
	import type { LogEntryShort } from '$lib/types';

	let currentEntries: LogEntryShort[] = [];
	let isOpen = false;

	const { set, setClickHandler } = getContext('map-overlay');

	const mapFeatures = (feature: Feature<Geometry>): LogEntryShort =>
		feature.getProperties() as LogEntryShort;

	const closeHandler = () => {
		isOpen = false;
		currentEntries = [];
	};

	const openOverlay = (features: Feature<Geometry>[]) => {
		isOpen = true;
		currentEntries = features.map(mapFeatures);
	};

	const clickHandler = (e: CustomEvent) => {
		const f = e.detail.feature;
		const features = f.get('features');
		if (features.length === 1) {
			isOpen = false;
			set(false);
			goto(`/log/${features[0].get('id')}`);
		} else {
			openOverlay(features);
		}
	};

	set(false);
	setClickHandler(clickHandler);
</script>

<svelte:head>
	<title>Karte der Segelreise</title>
	<link rel="canonical" href="https://www.ein-tierischer-segelsommer.de/" />
</svelte:head>

<nav class="main-navigation">
	<div class="tss-navigation ol-unselectable ol-control" style="pointer-events: auto;">
		<button
			type="button"
			aria-expanded="false"
			title="Zeitleiste"
			on:click={() => goto('/timeline')}
		>
			<i class="bi bi-view-list" />
		</button>
	</div>
</nav>

<Overlay {isOpen} on:close={closeHandler}>
	<nav class="close-navigation glass" on:click|preventDefault={closeHandler}>
		<i class="bi bi-x-circle" />
	</nav>

	<div class="entry-list">
		<LogbookEntries entries={currentEntries} />
	</div>
</Overlay>

<a href="/impressum" class="impressum" title="Impressum">Impressum</a>

<style lang="scss">
	.impressum {
		position: fixed;
		bottom: 3px;
	}
	@media (max-width: 768px) {
		.impressum {
			left: 65px;
		}
	}

	.entry-list {
		display: block;
		margin-right: 16px;
	}
	.close-navigation {
		position: -webkit-sticky;
		position: sticky;
		float: right;
		top: 16px;
	}
</style>
