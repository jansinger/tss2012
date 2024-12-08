<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppState } from '$lib/AppState.svelte';
	import { fly } from 'svelte/transition';

	let {children, outside = undefined } = $props();
	let content: HTMLElement = $state(undefined);
	let isOpen = $state(true);

	function contains(event) {
		const path = event.path || event.composedPath();
		return path.includes(content);
	}

	function handleWindowClick(event) {
		event.preventDefault();
		if (!isOpen || contains(event)) return;
		close();
	}

	function handleWindowKeyDown(event) {
		event.preventDefault();
		if (!isOpen) return;
		if (event.key === 'Escape') {
			close();
		}
	}

	export function close() {
		AppState.currentEntries = [];
		isOpen = false;
		goto('/');
	}

</script>

<svelte:window on:mousedown={handleWindowClick} on:keydown={handleWindowKeyDown} />

{#if isOpen}
	{@render outside?.()}
	<div class="container-article" transition:fly bind:this={content}>
		{@render children?.()}
	</div>
{/if}
