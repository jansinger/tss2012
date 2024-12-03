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
	<a href="/log/{f.id}" title={stripHtml(f.title)} onclick={() => { AppState.currentEntries=[]} }>
		<article class="glass">
			<div class="img-container">
				<img src="/images/{f.picture}" loading="lazy" title={f.pictureTitle} alt={f.pictureTitle} />
			</div>
			<div class="text-container">
				<time datetime={f.datetime}>{f.localeDatetime}</time>
				<address>{f.section}</address>
				<p>{@html f.title}</p>
			</div>
		</article>
	</a>
{/each}

<style lang="scss">
	a {
		display: flex;
		margin: 0;
		padding: 0;
		width: calc(100% - 30px);
		text-decoration: none;
	}
	article {
		color: #efefef;
		padding: 0;
		margin: 5px;
		cursor: pointer;
		float: left;
		width: 100%;
		max-height: 150px;
		overflow: hidden;

		address {
			font-size: 0.8rem;
		}
		time {
			font-size: 0.9rem;
		}
	}
	article::before {
		clear: both;
	}

	article:hover {
		background-color: #2e628780;
		opacity: 1;
		.img-container img {
			opacity: 1;
		}
	}
	article .img-container {
		width: 200px;
		text-align: center;
		margin-right: 10px;
		float: left;
	}

	article .img-container img {
		height: 150px;
		max-width: 200px;
		text-align: center;
		margin-right: 10px;
		float: left;
		border-radius: 0.5em 0 0 0.5em;
		filter: brightness(0.9) contrast(1.2);
		opacity: 0.6;
	}
	article .text-container {
		padding: 10px;
	}
	article p {
		line-height: 1.4;
	}
	@media screen and (max-width: 700px) {
		article .img-container {
			width: 100px;
			height: 100%;
		}
		article .img-container img {
			height: 75px;
			max-width: 100px;
		}
		article .text-container {
			padding: 5px;
			font-size: 0.75em;
		}
	}
</style>
