<script lang="ts">
	import { goto } from '$app/navigation';
	import type { LogEntryShort } from '$lib/types';

	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	const { set } = getContext('map-overlay');

	set(true);

	
	interface Props {
		/** @type {import('./$types').PageData */
		data: any;
	}

	let { data }: Props = $props();
	let {groupedEntries}: { groupedEntries: { [key: string]: LogEntryShort[] }} = data;
</script>

<svelte:head>
	<title>Zeitleiste der Segelreise</title>
	<link rel="canonical" href="https://www.ein-tierischer-segelsommer.de/timeline" aria-label="TSS: Timeline"/>
</svelte:head>

<nav class="main-navigation">
	<div class="tss-navigation ol-unselectable ol-control" style="pointer-events: auto;">
		<button type="button" aria-expanded="false" title="Karte" aria-label="Karte" onclick={() => goto('/')} >
			<i class="bi bi-map"></i>
		</button>
	</div>
</nav>

<div class="content" transition:fly>
	<section class="timeline">
		<div class="container">
			<div class="timeline__wrapper">
				<div class="timeline__progressbar"></div>
				{#each Object.entries(groupedEntries) as [key, value]}
					<div class="timeline__block">
						<div class="timeline__block__bullet-point">
							<span class="timeline__block__circle"></span>
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
				<div class="timeline__hider"></div>
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
		background-color: #2e628780;
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
