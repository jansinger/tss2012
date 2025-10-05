<script lang="ts">
	import type { LogEntry } from '$lib/types';
	import { stripHtml } from '$lib/utils/striphtml';
	import OverviewMap from './OverviewMap.svelte';
	import Pictures from './Pictures.svelte';
	import { goto } from '$app/navigation';
	import { AppState } from '$lib/AppState.svelte';

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

	/**
	 * Handles keyboard navigation between log entries.
	 * Arrow keys (Left/Right) navigate between entries.
	 *
	 * @param {KeyboardEvent} e - The keyboard event object.
	 * @returns {void}
	 */
	const handleKeyboardNav = (e: KeyboardEvent) => {
		if (e.key === 'ArrowLeft' && entry._prev) {
			e.preventDefault();
			if (!block) {
				block = true;
				goto(`/log/${entry._prev}`);
				setTimeout(() => (block = false), 300);
			}
		} else if (e.key === 'ArrowRight' && entry._next) {
			e.preventDefault();
			if (!block) {
				block = true;
				goto(`/log/${entry._next}`);
				setTimeout(() => (block = false), 300);
			}
		}
	};

	const close = (event) => {
		event.preventDefault();
		AppState.currentEntries = [];
		goto('/');
	}
</script>

<svelte:head>
	<title>{stripHtml(entry.title)}</title>
	<link rel="canonical" href="https://www.ein-tierischer-segelsommer.de/log/{entry._id}" />
	<meta name="geo.placename" content={stripHtml(entry.section)} />
	<meta name="geo.position" content="{entry.data?.coordinates[1]};{entry.data?.coordinates[0]}" />
	<meta name="ICBM" content="{entry.data?.coordinates[1]}, {entry.data?.coordinates[0]}" />
</svelte:head>

<svelte:window onkeydown={handleKeyboardNav} />

<p id="nav-description" class="visually-hidden">
	Nutzen Sie die Pfeiltasten links/rechts oder horizontales Scrollen, um zwischen den Logbuch-Einträgen zu navigieren.
</p>

<nav class="sub-navigation" role="navigation" aria-label="Navigation zwischen Beiträgen" aria-describedby="nav-description" onwheel={trackWheel}>
	<div class="item-wrapper left">
		{#if entry._prev}
			<a href="/log/{entry._prev}"
				title="Vorheriger Beitrag"
				aria-label="Vorheriger Beitrag"><i class="bi bi-caret-left-fill"></i></a>
		{:else}
			<span class="disabled-link" aria-hidden="true"><i class="bi bi-caret-left-fill"></i></span>
		{/if}
	</div>
	<div class="item-wrapper center">
		<time datetime={entry.datetime}>{entry.localeDatetime}</time>
	</div>
	<div class="item-wrapper right">
		{#if entry._next}
			<a href="/log/{entry._next}"
				title="Nächster Beitrag"
				aria-label="Nächster Beitrag"><i class="bi bi-caret-right-fill"></i></a>
		{:else}
			<span class="disabled-link" aria-hidden="true"><i class="bi bi-caret-right-fill"></i></span>
		{/if}
	</div>
</nav>
<content class="container glass">
	<nav class="close-navigation">
		<a href="/" onclick={close} title="Zur Karte" aria-label="Zur Karte"><i class="bi bi-x-circle"></i></a>
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
