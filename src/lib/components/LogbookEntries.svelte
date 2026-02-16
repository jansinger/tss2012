<script lang="ts">
	import { AppState } from '$lib/AppState.svelte';
    import type { LogEntryShort } from '$lib/types';
    import { sortEntries } from '$lib/utils/sortEntries';
    import { stripHtml } from '$lib/utils/striphtml';

    /**
     * Represents the props for the LogbookEntries component.
     * @typedef {Object} Props
     * @property {LogEntryShort[]} [entries] - An optional array of log entries to display.
     */
    interface Props {
        entries?: LogEntryShort[];
    }

    /**
     * The entries prop, destructured from $props().
     * @type {LogEntryShort[]}
     */
    let { entries = [] }: Props = $props();

    /**
     * A derived store that contains the sorted log entries.
     * @type {LogEntryShort[]}
     */
    let sortedEntries: LogEntryShort[] = $derived(sortEntries(entries));

</script>

{#each sortedEntries as f}
	<a href="/log/{f.id}" class="entry-card-link" title={stripHtml(f.title)} onclick={() => { AppState.currentEntries=[]} }>
		<article class="entry-card glass">
			<div class="entry-card__image-wrap">
				<picture>
					<source srcset="/images/{f.picture.replace('.jpg', '.webp')}" type="image/webp" />
					<img class="entry-card__image" src="/images/{f.picture}" loading="lazy" title={f.pictureTitle} alt={f.pictureTitle} />
				</picture>
			</div>
			<div class="entry-card__text">
				<time class="entry-card__time" datetime={f.datetime}>{f.localeDatetime}</time>
				<address class="entry-card__address">{f.section}</address>
				<!--
					@html is used for formatted titles from static JSON.
					Data source: src/lib/data/logbook.json (trusted static content)
				-->
				<p class="entry-card__title">{@html f.title}</p>
			</div>
		</article>
	</a>
{/each}

<style lang="scss">
	@use '../scss/entry-card';
</style>
