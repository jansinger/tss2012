<script lang="ts">
	import LogbookEntries from "$lib/components/LogbookEntries.svelte";
	/** @type {import('./$types').PageData */
	export let data;
</script>
<div class="content">
	<LogbookEntries entries={ data.entries } />
</div>

<style lang="scss">
	.content {
		padding: 20px 0 20px 20px;
	}
</style>
