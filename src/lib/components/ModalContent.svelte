<script type="ts">
	import { getContext } from 'svelte';
	import LogbookEntry from './LogbookEntry.svelte';

	export let id: string;

	const { open } = getContext('simple-modal');

	$: id && open(LogbookEntry, { id }, { styleWindow: { width: '100%' } });
</script>
