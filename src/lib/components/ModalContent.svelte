<script type="ts">
	import { getContext } from 'svelte';
	import LogbookEntry from './LogbookEntry.svelte';

	export let id: string;
	let entry: Record<string, any>;

	const { open } = getContext('simple-modal');

	const loadEntry = async (id: string) => {
		const res = await fetch(`/logentry/${id}.json`);
		if (res.status === 200) {
			entry = await res.json();
			open(LogbookEntry, { entry }, { styleWindow: { width: '100%' } });
		} else {
			entry = {};
		}
	};

	$: id && loadEntry(id);
</script>
