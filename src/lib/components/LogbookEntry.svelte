<script lang="ts">
	import type { LogEntry } from '$lib/types';
	import { stripHtml } from '$lib/utils/striphtml';
	import OverviewMap from './OverviewMap.svelte';
	import Pictures from './Pictures.svelte';
	import { goto } from '$app/navigation';

	interface Props {
	    entry?: LogEntry;
	}
	
	let { entry = null }: Props = $props();
	let block = false;
	
	/**
	 * Handles horizontal wheel events to navigate between log entries.
	 * 
	 * This function prevents the default wheel behavior and navigates to the previous
	 * or next log entry based on the horizontal scroll direction. It also implements
	 * a debounce mechanism to prevent rapid successive navigations.
	 * 
	 * @param {WheelEvent} e - The wheel event object.
	 * @returns {void}
	 */
	const trackWheel = (e: WheelEvent) => {
	    const { deltaX } = e;
	
	    if (deltaX) {
	        e.preventDefault();
	        if (!block) {
	            block = true;
	            goto(deltaX < 0 ? `/log/${entry._prev}` : `/log/${entry._next}`);
	            setTimeout(() => (block = false), 1000);
	        }
	    }
	};
</script>

<svelte:head>
	<title>{stripHtml(entry.title)}</title>
	<link rel="canonical" href="https://www.ein-tierischer-segelsommer.de/log/{entry._id}" aria-label="Ein tierischer Segelsommer" />
	<meta name="geo.placename" content={stripHtml(entry.section)} />
	<meta name="geo.position" content="{entry.data?.coordinates[1]};{entry.data?.coordinates[0]}" />
	<meta name="ICBM" content="{entry.data?.coordinates[1]}, {entry.data?.coordinates[0]}" />
</svelte:head>

<nav class="sub-navigation" onwheel={trackWheel}>
	<div class="item-wrapper left">
		<a 	href={entry._prev ? `/log/${entry._prev}` : '#'}
			class:disabled-link={entry._prev === undefined}
			title="Vorheriger Beitrag" aria-label="Vorheriger Beitrag"><i class="bi bi-caret-left-fill"></i></a
		>
	</div>
	<div class="item-wrapper center">
		<time datetime={entry.datetime}>{entry.localeDatetime}</time>
	</div>
	<div class="item-wrapper right">
		<a	href={entry._next ? `/log/${entry._next}` : '#'}
			class:disabled-link={!entry._next}
			title="Nächster Beitrag" aria-label="Nächster Beitrag"><i class="bi bi-caret-right-fill"></i></a
		>
	</div>
</nav>
<content class="container glass">
	<nav class="close-navigation">
		<a href="/" title="Zur Karte" aria-label="Zur Karte"><i class="bi bi-x-circle"></i></a>
	</nav>
	<header>
		<address>{entry.section}</address>
		<h1>{@html entry.title}</h1>
	</header>

	<section class="pictures">
		<Pictures pictures={entry.pictures} folder={entry.pictureFolder} />
	</section>
	<section class="overview-map">
		<OverviewMap coordinates={entry.data.coordinates} />
	</section>
	<article class="main-content">
		{@html entry.text}
	</article>
</content>

<style lang="scss">
	@import '../scss/article.css';
	article {
		position: relative;
		margin-bottom: 20px;
		margin-top: 15px;
	}
	address {
		padding-top: 20px;
		font-size: 0.8em;
		text-align: left;
	}
	section.overview-map {
		position: relative;
		margin: 15px 0 10px 15px;
		padding: 0;
		float: right;
		z-index: 10;
		height: 200px;
		:global(.map) {
			width: 200px;
			height: 200px;
			-moz-border-radius: 15px;
			border-radius: 15px;
			overflow: hidden;
			-webkit-backface-visibility: hidden;
			-moz-backface-visibility: hidden;
			-webkit-transform: translate3d(0, 0, 0);
			-moz-transform: translate3d(0, 0, 0);
		}
	}

	@media screen and (max-width: 600px) {
		section.overview-map {
			float: none;
			padding: 15px auto;
			margin: 20px 0 0 0;
			width: 100%;
			:global(.map) {
				margin: 10px auto;
				width: 100%;
			}
		}
	}
</style>
