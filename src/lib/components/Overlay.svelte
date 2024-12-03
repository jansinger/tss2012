<script lang="ts">
	import { fly } from 'svelte/transition';

	let {children, outside = undefined } = $props();
	let content: HTMLElement = $state(undefined);
	let isOpen = $state(true);

	function contains(event) {
		const path = event.path || event.composedPath();
		return path.includes(content);
	}

	function handleWindowClick(event) {
		if (!isOpen || contains(event)) return;
		close();
	}

	function handleWindowKeyDown(event) {
		if (!isOpen) return;
		if (event.key === 'Escape') {
			close();
		}
	}

	export function close() {
		isOpen = false;
	}

</script>

<svelte:window on:mousedown={handleWindowClick} on:keydown={handleWindowKeyDown} />

{#if isOpen}
	{@render outside?.()}
	<div class="container-article" transition:fly bind:this={content}>
		{@render children?.()}
	</div>
{/if}
