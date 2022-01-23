<script type="ts" context="module">
	export const prerender = true;
	import logbookEntries from '$lib/data/logbook.json';

	let sortedEntries = logbookEntries.sort(
		(a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
	);
</script>

<ul>
	{#each sortedEntries as entry}
		<li>{entry.localeDatetime} <a href="/logentry/{entry._id}">{@html entry.title}</a></li>
	{/each}
</ul>
