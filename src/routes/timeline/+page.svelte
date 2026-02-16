<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';
	import type { LogEntryShort } from '$lib/types';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from '$lib/utils/a11y';

	interface Props {
		/** @type {import('./$types').PageData */
		data: {
			groupedEntries: { [key: string]: LogEntryShort[] };
		};
	}

	let { data }: Props = $props();

	// Use $derived to keep groupedEntries reactive when data changes
	let groupedEntries = $derived(data.groupedEntries);
</script>

<svelte:head>
	<title>Zeitleiste der Segelreise</title>
	<link rel="canonical" href="https://www.ein-tierischer-segelsommer.de/timeline"/>
</svelte:head>

<nav class="main-navigation" aria-label="Hauptnavigation">
	<div class="tss-navigation ol-unselectable ol-control" style="pointer-events: auto;">
		<button type="button" title="Karte" aria-label="Zur Karte" onclick={() => goto('/')} >
			<Icon name="map" />
		</button>
	</div>
</nav>

<div class="content" transition:fly={{ duration: prefersReducedMotion() ? 0 : 400 }}>
	<section class="timeline" role="feed" aria-label="Chronologische Zeitleiste der Segelreise" aria-busy="false">
		<div class="container">
			<div class="timeline__wrapper">
				<div class="timeline__progressbar"></div>
				{#each Object.entries(groupedEntries) as [key, value], index}
					<div class="timeline__block">
						<div class="timeline__block__bullet-point">
							<span class="timeline__block__circle"></span>
						</div>
						<div class="timeline__block__head">
							{#if index === 0}
								<h1 class="timeline__block__title">{key}</h1>
							{:else}
								<h2 class="timeline__block__title">{key}</h2>
							{/if}
						</div>
						<div class="timeline__block__body">
							{#each value as entry}
								<a href="/log/{entry.id}" class="entry-card-link" aria-label="Beitrag vom {entry.localeDatetime}: {entry.title}">
									<article class="entry-card timeline__block__text glass" aria-labelledby="entry-{entry.id}-title">
										<div class="entry-card__image-wrap">
											<picture>
												<source srcset="/images/{entry.picture.replace('.jpg', '.webp')}" type="image/webp" />
												<img
													class="entry-card__image"
													src="/images/{entry.picture}"
													title={entry.pictureTitle}
													alt={entry.pictureTitle}
													loading="lazy"
												/>
											</picture>
										</div>
										<div class="entry-card__text">
											<time class="entry-card__time" datetime={entry.datetime}>{entry.localeDatetime}</time>
											<!--
												@html is used for formatted content from static JSON.
												Data source: src/lib/data/logbook.json (trusted static content)
											-->
											<address class="entry-card__address">{@html entry.section}</address>
											<p class="entry-card__title" id="entry-{entry.id}-title">{@html entry.title}</p>
										</div>
									</article>
								</a>
							{/each}
						</div>
					</div>
				{/each}
				<div class="timeline__hider"></div>
			</div>
		</div>
	</section>
</div>

<style lang="scss">
	@use '../../lib/scss/entry-card';
</style>
