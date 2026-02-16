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
	@use '../lib/scss/mixins';

	.container-article {
		max-width: 800px;
		overflow: scroll;
		padding: var(--space-5);
	}
	h1 {
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		font-weight: var(--font-weight-bold);
		margin: 0 0 0.5em 0;
	}

	pre {
		white-space: wrap;
		font-size: var(--font-size-sm);
	}

	@include mixins.bp-sm {
		h1 {
			font-size: 4em;
		}
	}
</style>
