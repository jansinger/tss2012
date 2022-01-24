<script type="ts" context="module">
	export const prerender = true;
	import { goto } from '$app/navigation';
	import LogbookEntries from '$lib/components/LogbookEntries.svelte';
	import origEntries from '$lib/data/logbook.json';

	const entries = origEntries.map((entry) => ({
		id: entry._id,
		title: entry.title,
		section: entry.section,
		datetime: entry.datetime,
		localeDatetime: entry.localeDatetime,
		picture: `${entry.pictureFolder}/${entry.pictures[0].filename}`,
		pictureTitle: entry.pictures[0].title
	}));

	const update = (id: string) => goto(`log/${id}`);
</script>

<LogbookEntries {entries} {update} />
