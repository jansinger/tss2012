<script lang="ts">
	import { fly } from 'svelte/transition';
	import { createEventDispatcher, tick } from 'svelte';

	import { getContext } from 'svelte';

	const { set } = getContext('map-overlay');
	const dispatch = createEventDispatcher();

	export let isOpen = false;
	let content: HTMLElement;

	function contains(event) {
		const path = event.path || event.composedPath();
		return path.includes(content);
	}

	function handleWindowClick(event) {
		if (!isOpen || contains(event)) return;
		isOpen = false;
		dispatch('close');
	}

	function handleWindowKeyDown(event) {
		if (!isOpen) return;
		if (event.key === 'Escape') {
			isOpen = false;
			dispatch('close');
		}
	}

	tick().then(() => {
		set(isOpen);
	});
</script>

<svelte:window on:mousedown={handleWindowClick} on:keydown={handleWindowKeyDown} />

{#if isOpen}
	<slot name="outside" />
	<div class="container-article" transition:fly bind:this={content}>
		<slot />
	</div>
{/if}
