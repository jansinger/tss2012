<script lang="ts">
	import type { LogEntry } from '$lib/types';
	import { stripHtml } from '$lib/utils/striphtml';
	import { closeAndNavigateHome } from '$lib/utils/appStateHelpers';
	import { createDebouncedNavigation } from '$lib/utils/navigation';
	import Icon from './Icon.svelte';
	import OverviewMap from './OverviewMap.svelte';
	import Pictures from './Pictures.svelte';

	interface Props {
		entry?: LogEntry | null;
	}

	let { entry = null }: Props = $props();

	// Error handling
	const hasValidEntry = $derived(entry && entry.data && entry.data.coordinates);

	// Navigation debounce delays
	const NAVIGATION_DEBOUNCE_WHEEL_MS = 1000;
	const NAVIGATION_DEBOUNCE_KEYBOARD_MS = 300;

	// Create debounced navigation handlers with proper cleanup
	const wheelNav = createDebouncedNavigation(NAVIGATION_DEBOUNCE_WHEEL_MS);
	const keyboardNav = createDebouncedNavigation(NAVIGATION_DEBOUNCE_KEYBOARD_MS);

	// Cleanup debounced navigations on component unmount
	$effect(() => {
		return () => {
			wheelNav.cleanup();
			keyboardNav.cleanup();
		};
	});

	/**
	 * Handles horizontal wheel events to navigate between log entries.
	 * Prevents default wheel behavior and implements debounce.
	 *
	 * @param e - The wheel event object
	 */
	const trackWheel = (e: WheelEvent): void => {
		if (!entry) return;
		const { deltaX } = e;

		if (deltaX) {
			e.preventDefault();
			const targetId = deltaX < 0 ? entry._prev : entry._next;
			if (!targetId) return;
			wheelNav.navigate(`/log/${targetId}`);
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
			keyboardNav.navigate(`/log/${entry._prev}`);
		} else if (e.key === 'ArrowRight' && entry._next) {
			e.preventDefault();
			keyboardNav.navigate(`/log/${entry._next}`);
		}
	};

	/**
	 * Closes the logbook entry and returns to map view
	 * @param event - Click event from close button
	 */
	const close = (event: Event): void => {
		event.preventDefault();
		closeAndNavigateHome();
	};
</script>

<svelte:head>
	<title>{entry ? stripHtml(entry.title) : 'Logbuch'}</title>
	{#if entry}
		<link rel="canonical" href="https://www.ein-tierischer-segelsommer.de/log/{entry._id}" />
		<meta name="geo.placename" content={stripHtml(entry.section)} />
		<meta name="geo.position" content="{entry.data?.coordinates?.[1]};{entry.data?.coordinates?.[0]}" />
		<meta name="ICBM" content="{entry.data?.coordinates?.[1]}, {entry.data?.coordinates?.[0]}" />
	{/if}
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
{:else if entry}
<nav class="sub-navigation" aria-label="Navigation zwischen Beiträgen" aria-describedby="nav-description" onwheel={trackWheel}>
	<div class="item-wrapper left">
		{#if entry._prev}
			<a href="/log/{entry._prev}"
				title="Vorheriger Beitrag"
				aria-label="Vorheriger Beitrag"><Icon name="caret-left-fill" /></a>
		{:else}
			<span class="disabled-link" aria-hidden="true"><Icon name="caret-left-fill" /></span>
		{/if}
	</div>
	<div class="item-wrapper center">
		<time datetime={entry.datetime}>{entry.localeDatetime}</time>
	</div>
	<div class="item-wrapper right">
		{#if entry._next}
			<a href="/log/{entry._next}"
				title="Nächster Beitrag"
				aria-label="Nächster Beitrag"><Icon name="caret-right-fill" /></a>
		{:else}
			<span class="disabled-link" aria-hidden="true"><Icon name="caret-right-fill" /></span>
		{/if}
	</div>
</nav>
<content class="container glass">
	<nav class="close-navigation">
		<a href="/" onclick={close} title="Zur Karte" aria-label="Zur Karte"><Icon name="x-circle" /></a>
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
		<Pictures pictures={entry.pictures ?? undefined} folder={entry.pictureFolder} />
	</section>
	<section class="overview-map">
		<OverviewMap coordinates={entry.data?.coordinates ?? undefined} />
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

	header {
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.15);
	}
	address {
		padding-top: 20px;
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.75);
		font-style: normal;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
	}
	h1 {
		font-size: 1.75rem;
		line-height: 1.35;
		margin: 0;
	}
	section.overview-map {
		position: relative;
		margin: 25px 0 15px 20px;
		padding: 0;
		float: right;
		z-index: 10;
		height: 250px;
		width: 250px;

		:global(.map) {
			width: 250px;
			height: 250px;
			border-radius: 12px;
			overflow: hidden;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		}
	}

	article.main-content {
		position: relative;
		margin-bottom: 20px;
		margin-top: 15px;

		:global(p) {
			margin-bottom: 1.25rem;
			hyphens: auto;
			text-align: justify;
		}

		// After map clears, limit text width for readability
		:global(p:nth-child(n+4)) {
			max-width: 65ch;
		}
	}

	@media screen and (max-width: 600px) {
		section.overview-map {
			float: none;
			margin: 20px auto 15px;
			width: 100%;
			height: auto;

			:global(.map) {
				margin: 0 auto;
				width: 100%;
				height: 200px;
			}
		}

		article.main-content {
			:global(p) {
				text-align: left;
			}
		}
	}
</style>
