<script type="ts">
	import { getContext } from 'svelte';
	import LogbookEntry from './LogbookEntry.svelte';

	export let id: string;
	let entry: Record<string, any>;

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
		const res = await fetch(`/logentry/${id}.json`);
		if (res.status === 200) {
			entry = await res.json();
			open(LogbookEntry, { entry }, modalProps);
		} else {
			entry = {};
		}
	};

	$: {
		id && loadEntry(id);
	}
</script>
