<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import LogbookEntries from '$lib/components/LogbookEntries.svelte';
	import Overlay from '$lib/components/Overlay.svelte';
	import { clearCurrentEntries } from '$lib/utils/appStateHelpers';

	let { currentEntries = $bindable() } = $props();

	const closeHandler = (e: Event) => {
		e.preventDefault();
		clearCurrentEntries();
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			clearCurrentEntries();
		}
	};
</script>

{#if currentEntries.length > 0}
<Overlay>
	<nav><button
		class="close-navigation glass"
		onclick={closeHandler}
		onkeydown={handleKeyDown}
		aria-label="Overlay schließen">
		<Icon name="x-circle" />
		</button>
	</nav>

	<div class="entry-list" role="region" aria-label="Logbuch-Einträge" aria-live="polite">
		<LogbookEntries entries={currentEntries} />
	</div>
</Overlay>
{/if}

<style lang="scss">
	.entry-list {
		display: block;
		margin-right: var(--space-4);
	}

	.close-navigation {
		position: sticky;
		float: right;
		top: var(--space-3-5, 15px);
		margin-right: var(--space-3);
		border: none;
		background: transparent;
		cursor: pointer;
		padding: var(--space-0-5) var(--space-1) var(--space-px);
		font-size: var(--font-size-xl);
		color: var(--color-text);

		&:hover {
			background-color: var(--color-primary-alpha);
		}
	}

	@media (pointer: coarse) {
		.close-navigation {
			font-size: var(--font-size-2xl);
		}
	}
</style>

