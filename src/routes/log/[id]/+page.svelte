<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';

	import LogbookEntry from '$lib/components/LogbookEntry.svelte';
	import Overlay from '$lib/components/Overlay.svelte';

	
	interface Props {
		/** @type {import('./$types').PageData */
		data: any;
	}

	let { data }: Props = $props();
	let isOpen = true;
</script>

<Overlay {isOpen} on:close={() => goto('/')}>
	<div class="container-article" transition:fly>
		<LogbookEntry entry={data.entry} />
		<a href="/impressum" class="impressum" title="Impressum">Impressum</a>
	</div>
</Overlay>
