<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import LogbookEntries from '$lib/components/LogbookEntries.svelte';
	import Overlay from '$lib/components/Overlay.svelte';

	let { currentEntries = $bindable() } = $props();

	const closeHandler = (e: Event) => {
		e.preventDefault();
		currentEntries = [];
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			currentEntries = [];
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
		margin-right: 16px;
	}

	.close-navigation {
		position: sticky;
		float: right;
		top: 15px;
		margin-right: 12px;
		border: none;
		background: transparent;
		cursor: pointer;
		padding: 2px 4px 1px;
		font-size: 1.3rem;
		color: #fff;

		&:hover {
			background-color: #2e628788;
		}
	}

	@media (pointer: coarse) {
		.close-navigation {
			font-size: 1.5rem;
		}
	}
</style>

