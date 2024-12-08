<script lang="ts">
	import { fly } from 'svelte/transition';

	import LogbookEntry from '$lib/components/LogbookEntry.svelte';
	import Overlay from '$lib/components/Overlay.svelte';
	import { AppState } from '$lib/AppState.svelte';

	
	interface Props {
		/** @type {import('./$types').PageData */
		data: any;
	}

	let { data }: Props = $props();

	AppState.currentEntries = [data.entry];

</script>

<Overlay>
	<div class="container-article" transition:fly>
		<LogbookEntry entry={data.entry} />
		<a href="/impressum" class="impressum" title="Impressum">Impressum</a>
	</div>
</Overlay>
