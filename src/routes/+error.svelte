<script lang="ts" context="module">
	import { goto } from '$app/navigation';

	import Overlay from '$lib/components/Overlay.svelte';

	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		return {
			props: {
				status,
				error
			}
		};
	}
	const dev = process.env.NODE_ENV === 'development';
</script>

<script lang="ts">
	export let status: string;
	export let error: Error;
</script>

<svelte:head>
	<title>{status}: {error?.message}</title>
</svelte:head>

<Overlay isOpen={true} on:close={() => goto('/')}>
	<div class="container-article glass">
		<article>
			<h1>{status}</h1>

			<h2>{error?.message}</h2>

			{#if dev && error?.stack}
				<pre>{error?.stack}</pre>
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
