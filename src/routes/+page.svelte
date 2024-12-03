<script lang="ts">
	import LogbookEntriesOverlay from '$lib/components/LogbookEntriesOverlay.svelte';
	import { goto } from '$app/navigation';
	import { AppState } from '$lib/AppState.svelte';

</script>

<svelte:head>
	<title>Karte der Segelreise</title>
	<link rel="canonical" href="https://www.ein-tierischer-segelsommer.de/" aria-label="Ein tierischer Segelsommer"/>
</svelte:head>

<nav class="main-navigation">
	<div class="tss-navigation ol-unselectable ol-control" style="pointer-events: auto;">
		<button
			type="button"
			aria-expanded="false"
			title="Zeitleiste"
			aria-label="Zeitleiste"
			onclick={() => goto('/timeline')}
		>
			<i class="bi bi-view-list"></i>
		</button>
	</div>
</nav>

{#if AppState.currentEntries.length > 0}
<LogbookEntriesOverlay bind:currentEntries={AppState.currentEntries}></LogbookEntriesOverlay>
{/if}

<a href="/impressum" class="impressum" title="Impressum">Impressum</a>

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
