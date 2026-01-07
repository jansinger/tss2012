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
		padding: 20px 0 20px 20px;
	}
</style>
