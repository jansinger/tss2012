<script type="ts">
	import './_index.scss';
	import LogbookMap from '$lib/components/LogbookMap.svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import type { Feature } from 'ol';
	import type Geometry from 'ol/geom/Geometry';
	import type { LogEntryShort } from '$lib/types';
	import Overlay from '$lib/components/Overlay.svelte';
	import LogbookEntries from '$lib/components/LogbookEntries.svelte';
	import { setContext } from 'svelte';

	const mapFeatures = (feature: Feature<Geometry>) => feature.getProperties();
	let currentEntries: LogEntryShort[] = [];
	let isOpen = false;

	let isOpenOverlay = false;

	const set = (overlay: boolean) => (isOpenOverlay = overlay);

	setContext('map-overlay', { set });

	const clickLogbook = (e: CustomEvent) => {
		const f = e.detail.feature;
		const features = f.get('features');
		if (features.length === 1) {
			isOpen = false;
			isOpenOverlay = false;
			goto(`/log/${features[0].get('id')}`);
		} else {
			isOpen = true;
			isOpenOverlay = true;
			currentEntries = features.map(mapFeatures);
		}
	};
</script>

<main>
	<div class:noscroll={isOpenOverlay}>
		<LogbookMap on:clickLogbook={clickLogbook} />
	</div>

	<Overlay {isOpen}>
		<LogbookEntries entries={currentEntries} />
	</Overlay>

	<slot />
</main>
