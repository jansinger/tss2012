<script type="ts" context="module">
	export const prerender = true;

	import { goto } from '$app/navigation';
	import origEntries from '$lib/data/logbook.json';
	import type { LogEntryShort } from '$lib/types';

	const monthNames = [
		'Januar',
		'Februar',
		'März',
		'April',
		'Mai',
		'Juni',
		'Juli',
		'August',
		'September',
		'Oktober',
		'November',
		'Dezember'
	];

	const entries: LogEntryShort[] = origEntries.map((entry) => ({
		id: entry._id,
		title: entry.title,
		section: entry.section,
		abstract: entry.abstract,
		datetime: entry.datetime,
		localeDatetime: entry.localeDatetime,
		picture: `${entry.pictureFolder}/${entry.pictures[0].filename}`,
		pictureTitle: entry.pictures[0].title,
		key: `${monthNames[new Date(entry.datetime).getMonth()]} ${new Date(
			entry.datetime
		).getFullYear()}`
	}));

	let sortedEntries = entries.sort(
		(a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
	);

	const groupBy = function (xs, key) {
		return xs.reduce(function (rv, x) {
			(rv[x[key]] = rv[x[key]] || []).push(x);
			return rv;
		}, {});
	};

	const groupedEntries: { [key: string]: LogEntryShort[] } = groupBy(sortedEntries, 'key');
</script>

<script type="ts">
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	const { set } = getContext('map-overlay');

	set(true);
</script>

<svelte:head>
	<title>Zeitleiste der Segelreise</title>
	<link rel="canonical" href="https://www.ein-tierischer-segelsommer.de/timeline" />
</svelte:head>

<nav class="main-navigation">
	<div class="tss-navigation ol-unselectable ol-control" style="pointer-events: auto;">
		<button type="button" aria-expanded="false" title="Karte" on:click={() => goto('/')}>
			<i class="bi bi-map" />
		</button>
	</div>
</nav>

<div class="content" transition:fade>
	<section class="timeline">
		<div class="container">
			<div class="timeline__wrapper">
				<div class="timeline__progressbar" />
				{#each Object.entries(groupedEntries) as [key, value]}
					<div class="timeline__block">
						<div class="timeline__block__bullet-point">
							<span class="timeline__block__circle" />
						</div>
						<div class="timeline__block__head">
							<h1 class="timeline__block__title">{key}</h1>
						</div>
						<div class="timeline__block__body">
							{#each value as entry}
								<a href="/log/{entry.id}">
									<article class="timeline__block__text glass">
										<div class="img-container">
											<img
												src="/images/{entry.picture}"
												title={entry.pictureTitle}
												alt={entry.pictureTitle}
											/>
										</div>
										<div class="text-container">
											<time datetime={entry.datetime}>{entry.localeDatetime}</time>
											<address>{@html entry.section}</address>
											<p>{@html entry.title}</p>
										</div>
									</article>
								</a>
							{/each}
						</div>
					</div>
				{/each}
				<div class="timeline__hider" />
			</div>
		</div>
	</section>
</div>

<style lang="scss">
	.img-container img {
		max-width: 200px;
		max-height: 150px;
	}
	article {
		padding: 0;
		margin: 5px;
		cursor: pointer;
		float: left;
		width: calc(100% - 30px);
		max-height: 150px;
		overflow: hidden;
		scroll-behavior: auto;
	}
	article::before {
		clear: both;
	}

	article:hover {
		background-color: #2e6287;
		opacity: 1;
		.img-container img {
			opacity: 1;
		}
	}

	article time {
		font-size: 0.9rem;
	}
	article address {
		font-size: 0.8rem;
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
		border-radius: 0.5rem 0 0 0.5rem;
		opacity: 0.6;
	}
	article .text-container {
		padding: 10px;
	}
	article p {
		font-weight: bold;
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
			font-size: 0.8rem;
		}
		article p {
			font-weight: bold;
		}
	}
</style>
