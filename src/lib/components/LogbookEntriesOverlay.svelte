<script lang="ts">
	import LogbookEntries from '$lib/components/LogbookEntries.svelte';
	import Overlay from '$lib/components/Overlay.svelte';

	let { currentEntries = $bindable() } = $props();

	const closeHandler = (e) => {
		e.preventDefault();
		currentEntries = [];
	};

</script>

{#if currentEntries.length > 0}
<Overlay>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<nav><span role="button" tabindex="0"
		class="close-navigation glass"
		onclick={closeHandler}
		onkeypress={closeHandler}>
		<i class="bi bi-x-circle"></i>
		</span>
	</nav>

	<div class="entry-list">
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
	}
</style>

