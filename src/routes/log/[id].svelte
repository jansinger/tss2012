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
	import { fly } from 'svelte/transition';

	import LogbookEntry from '$lib/components/LogbookEntry.svelte';
	import Overlay from '$lib/components/Overlay.svelte';
	import type { LogEntry } from '$lib/types';

	export let entry: LogEntry;
	let isOpen = true;
</script>

<Overlay {isOpen} on:close={() => goto('/')}>
	<div class="container-article" transition:fly>
		<LogbookEntry {entry} />
		<a href="/impressum" class="impressum" title="Impressum">Impressum</a>
	</div>
</Overlay>
