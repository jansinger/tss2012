<script lang="ts">
	import { fly } from 'svelte/transition';

	import LogbookEntry from '$lib/components/LogbookEntry.svelte';
	import Overlay from '$lib/components/Overlay.svelte';
	import { AppState } from '$lib/AppState.svelte';
	import type { LogEntry, LogEntryShort } from '$lib/types';

	interface Props {
		data: {
			entry: LogEntry;
		};
	}

	let { data }: Props = $props();

	// Update AppState when data changes, with cleanup on unmount
	// Cast to LogEntryShort[] since LogEntry contains all required fields
	$effect(() => {
		AppState.currentEntries = [data.entry as unknown as LogEntryShort];

		return () => {
			AppState.currentEntries = [];
		};
	});
</script>

<Overlay>
	<div class="container-article" transition:fly>
		<LogbookEntry entry={data.entry} />
		<a href="/impressum" class="impressum" title="Impressum">Impressum</a>
	</div>
</Overlay>
