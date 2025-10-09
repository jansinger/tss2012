<script lang="ts">
	import type { LogEntry } from '$lib/types';
	import { stripHtml } from '$lib/utils/striphtml';
	import OverviewMap from './OverviewMap.svelte';
	import Pictures from './Pictures.svelte';
	import { goto } from '$app/navigation';
	import { AppState } from '$lib/AppState.svelte';

	interface Props {
	    entry?: LogEntry | null;
	}

	let { entry = null }: Props = $props();

	// Error handling
	const hasValidEntry = $derived(entry && entry.data && entry.data.coordinates);
	let block = false;

	// Navigation debounce delays
	const NAVIGATION_DEBOUNCE_WHEEL_MS = 1000;
	const NAVIGATION_DEBOUNCE_KEYBOARD_MS = 300;

	/**
	 * Navigates to a logbook entry with debounce protection
	 * @param path - The path to navigate to
	 * @param delay - Debounce delay in milliseconds
	 */
	const navigateWithDebounce = (path: string | undefined, delay: number): void => {
		if (!path || block) return;

		block = true;
		goto(path);
		setTimeout(() => (block = false), delay);
	};

	/**
	 * Handles horizontal wheel events to navigate between log entries.
	 * Prevents default wheel behavior and implements debounce.
	 *
	 * @param e - The wheel event object
	 */
	const trackWheel = (e: WheelEvent): void => {
	    const { deltaX } = e;

	    if (deltaX) {
	        e.preventDefault();
	        const targetId = deltaX < 0 ? entry._prev : entry._next;
	        if (!targetId) return;
	        const targetPath = `/log/${targetId}`;
	        navigateWithDebounce(targetPath, NAVIGATION_DEBOUNCE_WHEEL_MS);
	    }
	};

	/**
	 * Handles keyboard navigation between log entries.
	 * Arrow keys (Left/Right) navigate between entries.
	 *
	 * @param e - The keyboard event object
	 */
	const handleKeyboardNav = (e: KeyboardEvent): void => {
		if (!entry) return;
		if (e.key === 'ArrowLeft' && entry._prev) {
			e.preventDefault();
			navigateWithDebounce(`/log/${entry._prev}`, NAVIGATION_DEBOUNCE_KEYBOARD_MS);
		} else if (e.key === 'ArrowRight' && entry._next) {
			e.preventDefault();
			navigateWithDebounce(`/log/${entry._next}`, NAVIGATION_DEBOUNCE_KEYBOARD_MS);
		}
	};

	/**
	 * Closes the logbook entry and returns to map view
	 * @param event - Click event from close button
	 */
	const close = (event: Event): void => {
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

{#if !hasValidEntry}
	<div class="error-container">
		<p class="error-message">Logbuch-Eintrag konnte nicht geladen werden.</p>
		<a href="/" class="btn-back">Zurück zur Karte</a>
	</div>
{:else}
<nav class="sub-navigation" aria-label="Navigation zwischen Beiträgen" aria-describedby="nav-description" onwheel={trackWheel}>
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
		<!--
			@html is used here for formatted blog content from static JSON.
			Data source: src/lib/data/logbook.json (trusted, static content from 2012)
			Security: Content is not user-generated and comes from version-controlled files.
		-->
		<h1>{@html entry.title}</h1>
	</header>

	<section class="pictures">
		<Pictures pictures={entry.pictures} folder={entry.pictureFolder} />
	</section>
	<section class="overview-map">
		<OverviewMap coordinates={entry.data.coordinates} />
	</section>
	<article class="main-content">
		<!--
			@html is used here for formatted blog content from static JSON.
			Data source: src/lib/data/logbook.json (trusted, static content from 2012)
			Security: Content is not user-generated and comes from version-controlled files.
		-->
		{@html entry.text}
	</article>
</content>
{/if}

<style lang="scss">
	@import '../scss/article.css';

	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		text-align: center;
		padding: 2rem;
	}

	.error-message {
		font-size: 1.5rem;
		color: #ffd700;
		margin-bottom: 2rem;
	}

	.btn-back {
		padding: 0.75rem 1.5rem;
		background-color: #2e6287;
		color: #fff;
		text-decoration: none;
		border-radius: 4px;
		transition: background-color 0.2s;

		&:hover {
			background-color: #1a4d6d;
		}
	}

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
