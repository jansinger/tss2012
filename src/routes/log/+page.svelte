<script type="ts" context="module">
	export const prerender = true;
	import LogbookEntries from '$lib/components/LogbookEntries.svelte';
	import origEntries from '$lib/data/logbook.json';
	import type { LogEntryShort } from '$lib/types';

	const entries: LogEntryShort[] = origEntries.map((entry) => ({
		id: entry._id,
		title: entry.title,
		section: entry.section,
		abstract: entry.abstract,
		datetime: entry.datetime,
		localeDatetime: entry.localeDatetime,
		picture: `${entry.pictureFolder}/${entry.pictures[0].filename}`,
		pictureTitle: entry.pictures[0].title
	}));
</script>

<div class="content">
	<LogbookEntries {entries} />
</div>

<style lang="scss">
	.content {
		padding: 20px 0 20px 20px;
	}
</style>
