<script lang="ts">
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
		<i class="bi bi-x-circle"></i>
		</button>
	</nav>

	<div class="entry-list" role="region" aria-label="Logbuch-Einträge" aria-live="polite">
		<LogbookEntries entries={currentEntries} />
	</div>
</Overlay>
{/if}

<style lang="scss">
	.impressum {
		position: fixed;
		bottom: 3px;
	}
	@media (max-width: 768px) {
		.impressum {
			left: 65px;
		}
	}

	.entry-list {
		display: block;
		margin-right: 16px;
	}
	.close-navigation {
		position: -webkit-sticky;
		position: sticky;
		float: right;
		top: 15px;
		margin-right: 12px;
		border: none;
		background: transparent;
		cursor: pointer;
		padding: 2px 4px 1px;

		i {
			font-size: 1.3rem;
			color: #fff;
		}

		&:hover {
			background-color: #2e628788;
		}
	}

	@media (pointer: coarse) {
		.close-navigation i {
			font-size: 1.5rem;
		}
	}
</style>

