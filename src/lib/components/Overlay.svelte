<script lang="ts">
	import { closeAndNavigateHome } from '$lib/utils/appStateHelpers';
	import { prefersReducedMotion } from '$lib/utils/a11y';
	import { fly } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		outside?: Snippet;
	}

	let { children, outside = undefined }: Props = $props();
	let content: HTMLElement | undefined = $state(undefined);
	let isOpen = $state(true);

	/**
	 * Checks if the event target is contained within the overlay content
	 * @param event - Mouse or pointer event
	 * @returns True if event target is inside content element
	 */
	function contains(event: MouseEvent | PointerEvent): boolean {
		const path = event.composedPath();
		return content !== undefined && path.includes(content);
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
		if (!isOpen) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			close();
		}
	}

	/**
	 * Closes the overlay and navigates to home
	 */
	export function close(): void {
		isOpen = false;
		closeAndNavigateHome();
	}
</script>

<svelte:window onmousedown={handleWindowClick} onkeydown={handleWindowKeyDown} />

{#if isOpen}
	{@render outside?.()}
	<div class="container-article" transition:fly={{ duration: prefersReducedMotion() ? 0 : 400 }} bind:this={content}>
		{@render children?.()}
	</div>
{/if}
