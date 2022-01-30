<script type="ts" context="module">
	export const prerender = true;
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ params, fetch }) {
		const res = await fetch(`/log/${params.id}.json`);
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

<nav class="main-navigation">
	<div class="item-wrapper">
		<a href="/" title="Karte"><i class="fas fa-map-marked-alt" /></a>
	</div>
	<div class="item-wrapper">
		<a href="/timeline" title="Zeitleiste"><i class="fas fa-calendar-alt" /></a>
	</div>
</nav>

<div class="container">
	<LogbookEntry {entry} />
</div>

<style type="scss">
	.container {
		margin: 10px auto;
		padding: 50px 10px;
		max-width: 900px;
		position: relative;
	}
</style>
