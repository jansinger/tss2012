<script lang="ts">
	import LogbookMap from '$lib/components/LogbookMap.svelte';
	import { AppState } from '$lib/AppState.svelte';

	import './_layout.scss';
	interface Props {
		children?: import('svelte').Snippet;
	}


	let { children }: Props = $props();

</script>

<main>
	<div class:noscroll={AppState.currentEntries.length > 0}>
		<LogbookMap></LogbookMap>
	</div>

	{@render children?.()}
</main>
