<script type="ts">
	import type Feature from 'ol/Feature';
	import type Geometry from 'ol/geom/Geometry';

	import { getContext, setContext } from 'svelte';
	import LogbookEntry from './LogbookEntry.svelte';
	import LogbookEntries from './LogbookEntries.svelte';
	import type { LogEntryShort } from '$lib/types';

	export let feature: Feature<Geometry> | string;
	let entry: LogEntryShort;

	const { open } = getContext('simple-modal');

	const modalProps = {
		styleBg: {},
		styleWindowWrap: { margin: '10px' },
		styleWindow: { width: '100%', margin: '10px 0', padding: '5px 0' },
		styleContent: { 'max-height': 'calc(100vh - 20px)' },
		transitionWindowProps: {
			y: 100,
			duration: 250
		},
		transitionBgProps: {
			duration: 250
		}
	};

	const loadEntry = async (id: string) => {
		const res = await fetch(`/log/${id}.json`);
		if (res.status === 200) {
			entry = await res.json();
			open(LogbookEntry, { entry }, modalProps);
		} else {
			entry = null;
		}
	};

	const mapFeatures = (feature: Feature<Geometry>) => feature.getProperties();

	const handleFeature = async (feature: Feature<Geometry> | string) => {
		if (typeof feature === 'string') {
			loadEntry(String(feature));
			return;
		}
		const features = feature.get('features');
		if (features.length === 1) {
			loadEntry(features[0].get('id'));
		} else {
			const entries = features.map(mapFeatures);
			open(LogbookEntries, { entries, update: loadEntry });
		}
	};

	$: {
		feature && handleFeature(feature);
	}
</script>
