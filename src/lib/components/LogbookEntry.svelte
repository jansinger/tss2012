<script type="ts">
	import type { LogEntry } from '$lib/types';
	import OverviewMap from './OverviewMap.svelte';
	import Pictures from './Pictures.svelte';

	export let entry: LogEntry = null;
</script>

<svelte:head>
	<meta name="geo.placename" content={entry.section} />
	<meta name="geo.position" content="{entry.data?.coordinates[0]};{entry.data?.coordinates[1]}" />
</svelte:head>

<nav class="sub-navigation">
	<div class="item-wrapper left">
		<a
			href={entry._prev ? `/log/${entry._prev}` : '#'}
			class:disabled-link={entry._prev === undefined}
			title="Vorheriger Beitrag"><i class="fas fa-arrow-left" /></a
		>
	</div>
	<div class="item-wrapper center">
		<time datetime={entry.datetime}>{entry.localeDatetime}</time>
	</div>
	<div class="item-wrapper right">
		<a
			href={entry._next ? `/log/${entry._next}` : '#'}
			class:disabled-link={!entry._next}
			title="Nächster Beitrag"><i class="fas fa-arrow-right" /></a
		>
	</div>
</nav>
<content class="container">
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
	@import 'ol/ol.css';

	content.container {
		display: block;
		background-color: #2e6287;
		padding: 0 15px 10px;
		border-radius: 0 0 8px 8px;
	}
	article {
		position: relative;
		margin-bottom: 20px;
		margin-top: 15px;
	}
	address {
		font-size: 0.8em;
		text-align: center;
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

	@media screen and (max-width: 1140px) {
		.sub-navigation {
			margin-top: 60px;
		}
	}
</style>
