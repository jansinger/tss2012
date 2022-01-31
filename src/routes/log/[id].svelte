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

<script type="ts">
	import { goto } from '$app/navigation';

	import LogbookEntry from '$lib/components/LogbookEntry.svelte';
	import type { LogEntry } from '$lib/types';

	export let entry: LogEntry;
</script>

<nav class="main-navigation">
	<div class="tss-navigation ol-unselectable ol-control" style="pointer-events: auto;">
		<button
			type="button"
			aria-expanded="false"
			title="Zeitleiste"
			on:click={() => goto('/timeline')}
		>
			<i class="fas fa-calendar-alt" />
		</button>
		<button type="button" aria-expanded="false" title="Karte" on:click={() => goto('/')}>
			<i class="fas fa-map-marked-alt" />
		</button>
	</div>
</nav>

<div class="container">
	<LogbookEntry {entry} />
</div>

<style type="scss">
	.container {
		margin: 10px auto;
		padding: 0 10px;
		max-width: 900px;
		position: relative;
	}
</style>
