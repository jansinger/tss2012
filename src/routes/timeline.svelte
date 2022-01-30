<script type="ts" context="module">
	export const prerender = true;
	import ModalContent from '$lib/components/ModalContent.svelte';
	import Modal from 'svelte-simple-modal';
	import { browser } from '$app/env';

	import origEntries from '$lib/data/logbook.json';
	import type { LogEntryShort } from '$lib/types';
	import { goto } from '$app/navigation';

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
	import { onMount } from 'svelte';

	let timeline: HTMLElement;
	let feature: string;

	const handleClick = (entry: LogEntryShort) => {
		return () => (feature = entry.id);
	};

	const modalClosed = () => {
		feature = null;
	};
	onMount(() => timeline.focus());
</script>

<nav class="main-navigation">
	<div class="item-wrapper">
		<button on:click={() => goto('/')} title="Karte"><i class="fas fa-map-marked-alt" /></button>
	</div>
</nav>

<div class="content">
	<section class="timeline" bind:this={timeline}>
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
								<article class="timeline__block__text" on:click={handleClick(entry)}>
									<div class="img-container">
										<img
											src="/images/{entry.picture}"
											title={entry.pictureTitle}
											alt={entry.pictureTitle}
										/>
									</div>
									<div class="text-container">
										<time datetime={entry.datetime}>{entry.localeDatetime}</time>
										<address>{entry.section}</address>
										<p>{@html entry.title}</p>
									</div>
								</article>
							{/each}
						</div>
					</div>
				{/each}
				<div class="timeline__hider" />
			</div>
		</div>
	</section>
</div>

{#if browser}
	<Modal on:closed={modalClosed}>
		<ModalContent {feature} />
	</Modal>
{/if}

<style lang="scss">
	:global(body) {
		padding: 0;
		margin: 0;
		color: #efefef;
		background-color: #0b0b0b;
	}
	.img-container img {
		max-width: 200px;
		max-height: 150px;
	}
	article {
		background-color: #666666;
		border-radius: 0.5em;
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
		background-color: #888888;
	}

	article time {
		font-size: 0.9em;
	}
	article address {
		font-size: 0.8em;
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
			font-size: 0.8em;
		}
		article p {
			font-weight: bold;
		}
	}
</style>
