<script lang="ts">
	import LogbookEntriesOverlay from '$lib/components/LogbookEntriesOverlay.svelte';
	import { goto } from '$app/navigation';
	import { AppState } from '$lib/AppState.svelte';

</script>

<svelte:head>
	<title>Karte der Segelreise</title>
	<link rel="canonical" href="https://www.ein-tierischer-segelsommer.de/"/>
</svelte:head>

<h1 class="visually-hidden">Ein tierischer Segelsommer - Interaktive Karte</h1>

<p class="visually-hidden">
	Diese Seite zeigt eine interaktive Karte der Segelreise durch die Ostsee.
	Für eine barrierefreie Alternative nutzen Sie die <a href="/timeline">Zeitleisten-Ansicht</a>
	oder die <a href="/log">Logbuch-Liste</a>.
</p>

<nav class="main-navigation" role="navigation" aria-label="Hauptnavigation">
	<div class="tss-navigation ol-unselectable ol-control" style="pointer-events: auto;">
		<button
			type="button"
			title="Zeitleiste"
			aria-label="Zur Zeitleiste"
			onclick={() => goto('/timeline')}
		>
			<i class="bi bi-view-list"></i>
		</button>
	</div>
</nav>

<LogbookEntriesOverlay bind:currentEntries={AppState.currentEntries}></LogbookEntriesOverlay>

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
		position: sticky;
		float: right;
		top: 15px;
		margin-right: 12px;
	}
</style>
