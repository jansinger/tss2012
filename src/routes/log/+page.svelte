<script lang="ts">
	import LogbookEntries from "$lib/components/LogbookEntries.svelte";
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>
<div class="content">
	<LogbookEntries entries={ data.entries } />
</div>

<style lang="scss">
	.content {
		padding: var(--space-5) 0 var(--space-5) var(--space-5);
	}
</style>
