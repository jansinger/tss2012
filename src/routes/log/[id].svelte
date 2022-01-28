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
	import { goto } from '$app/navigation';
	import LogbookEntry from '$lib/components/LogbookEntry.svelte';

	export let entry;
</script>

<nav class="main-navigation">
	<!--div class="item-wrapper">
		<button title="Zeitleiste" on:click={() => goto('/timeline')}
			><i class="fas fa-calendar-alt" /></button
		>
	</div-->
	<div class="item-wrapper">
		<button on:click={() => goto('/')} title="Karte"><i class="fas fa-map-marked-alt" /></button>
	</div>
</nav>

<div class="container">
	<LogbookEntry {entry} />
</div>

<style type="scss">
	.container {
		margin: 10px;
	}
</style>
