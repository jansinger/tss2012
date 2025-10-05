<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppState } from '$lib/AppState.svelte';
	import { fly } from 'svelte/transition';

	let {children, outside = undefined } = $props();
	let content: HTMLElement = $state(undefined);
	let isOpen = $state(true);

	/**
	 * Checks if the event target is contained within the overlay content
	 * @param event - Mouse or pointer event
	 * @returns True if event target is inside content element
	 */
	function contains(event: MouseEvent | PointerEvent): boolean {
		const path = event.composedPath();
		return path.includes(content);
	}

	/**
	 * Handles clicks outside the overlay to close it
	 * @param event - Mouse event from window
	 */
	function handleWindowClick(event: MouseEvent): void {
		if (!isOpen || contains(event)) return;
		event.preventDefault();
		close();
	}

	/**
	 * Handles Escape key to close the overlay
	 * @param event - Keyboard event from window
	 */
	function handleWindowKeyDown(event: KeyboardEvent): void {
		event.preventDefault();
		if (!isOpen) return;
		if (event.key === 'Escape') {
			close();
		}
	}

	/**
	 * Closes the overlay and navigates to home
	 */
	export function close(): void {
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
