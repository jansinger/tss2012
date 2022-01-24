<script type="ts" context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ params, fetch }) {
		const res = await fetch(`/logentry/${params.id}.json`);
		if (res.status === 200) {
			return {
				props: {
					entry: await res.json()
				}
			};
		}
		return {
			status: res.status,
			error: new Error(`Could not load ${params.id}`)
		};
	}
</script>

<script>
	import LogbookEntry from '$lib/components/LogbookEntry.svelte';

	export let entry;
</script>

<div class="container">
	<LogbookEntry {entry} />
</div>

<style type="scss">
	.container {
		margin: 10px;
	}
</style>
