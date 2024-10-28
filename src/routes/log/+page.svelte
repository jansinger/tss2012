<script lang="ts">
	import LogbookEntries from "$lib/components/LogbookEntries.svelte";
	
	interface Props {
		/** @type {import('./$types').PageData */
		data: any;
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
