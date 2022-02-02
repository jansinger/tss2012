<script type="ts" context="module">
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';
	export const prerender = true;
</script>

<script type="ts">
	const { set } = getContext('map-overlay');
	set(false);
</script>

<svelte:head>
	<title>Karte der Segelreise</title>
	<link rel="canonical" href="https://www.ein-tierischer-segelsommer.de/" />
</svelte:head>

<nav class="main-navigation">
	<div class="tss-navigation ol-unselectable ol-control" style="pointer-events: auto;">
		<button
			type="button"
			aria-expanded="false"
			title="Zeitleiste"
			on:click={() => goto('/timeline')}
		>
			<i class="bi bi-view-list" />
		</button>
	</div>
</nav>

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
</style>
