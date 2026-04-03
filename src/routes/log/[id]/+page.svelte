<script lang="ts">
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from '$lib/utils/a11y';

	import LogbookEntry from '$lib/components/LogbookEntry.svelte';
	import Overlay from '$lib/components/Overlay.svelte';
	import { AppState } from '$lib/AppState.svelte';
	import type { LogEntry } from '$lib/types';
	import { logEntryToShort } from '$lib/types';

	interface Props {
		data: {
			entry: LogEntry;
		};
	}

	let { data }: Props = $props();

	// Update AppState when data changes, with cleanup on unmount
	$effect(() => {
		AppState.currentEntries = [logEntryToShort(data.entry)];

		return () => {
			AppState.currentEntries = [];
		};
	});
</script>

<Overlay>
	<div class="container-article" transition:fly={{ duration: prefersReducedMotion() ? 0 : 400 }}>
		<LogbookEntry entry={data.entry} />
	</div>
</Overlay>
