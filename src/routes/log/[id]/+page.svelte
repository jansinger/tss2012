<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';

	import LogbookEntry from '$lib/components/LogbookEntry.svelte';
	import Overlay from '$lib/components/Overlay.svelte';

	/** @type {import('./$types').PageData */
	export let data;
	let isOpen = true;
</script>

<Overlay {isOpen} on:close={() => goto('/')}>
	<div class="container-article" transition:fly>
		<LogbookEntry entry={data.entry} />
		<a href="/impressum" class="impressum" title="Impressum">Impressum</a>
	</div>
</Overlay>
