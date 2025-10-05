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
	<div class="impressum-control ol-unselectable ol-control" style="pointer-events: auto;">
		<button
			type="button"
			title="Impressum"
			aria-label="Zum Impressum"
			onclick={() => goto('/impressum')}
		>
			<i class="bi bi-info-circle"></i>
		</button>
	</div>
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

<style lang="scss">
	.impressum-control {
		bottom: 0.5em;
		right: 5em;
		z-index: 5;
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
