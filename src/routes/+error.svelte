<script lang="ts">
	import { page } from '$app/stores';
	import Overlay from '$lib/components/Overlay.svelte';
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>{$page.status}: {$page.error?.message}</title>
</svelte:head>

<Overlay>
	<div class="container-article glass">
		<article>
			<h1>Error: {$page.status}</h1>

			<h2>{$page.error?.message}</h2>

			{#if dev && $page.error && 'stack' in $page.error}
				<pre>{$page.error?.stack}</pre>
			{/if}
		</article>
	</div>
</Overlay>

<style lang="scss">
	.container-article {
		max-width: 800px;
		overflow: scroll;
		padding: 20px;
	}
	h1 {
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	pre {
		white-space: wrap;
		font-size: 0.8rem;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
