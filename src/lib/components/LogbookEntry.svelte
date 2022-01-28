<script type="ts">
	import { afterUpdate } from 'svelte';
	import { browser } from '$app/env';
	import type { Splide, Options } from '@splidejs/splide';
	import type { LogEntry, PicturesEntity } from '$lib/types';

	type SplideConstructor = new (target: string | HTMLElement, options?: Options) => Splide;

	export let entry: LogEntry = null;
	let pictures: Array<PicturesEntity> = [];
	let splide: SplideConstructor, main: Splide, thumbnails: Splide;

	const splideOptions = {
		type: 'fade',
		//heightRatio: 0.5,
		pagination: false,
		arrows: false,
		autoHeight: true
	};

	const thumSlider = {
		rewind: true,
		fixedWidth: 104,
		fixedHeight: 58,
		isNavigation: true,
		gap: 0,
		focus: 'center' as const,
		pagination: false,
		cover: true,
		dragMinThreshold: {
			mouse: 4,
			touch: 10
		},
		breakpoints: {
			640: {
				fixedWidth: 66,
				fixedHeight: 38
			}
		}
	};

	afterUpdate(async () => {
		// new entry, destroy old slider
		main?.destroy();
		thumbnails?.destroy();
		pictures = entry?.pictures;

		if (!splide) {
			const module = await import('@splidejs/splide');
			splide = module.Splide;
		}
		main = new splide('#main-slider', splideOptions);
		thumbnails = new splide('#thumbnail-slider', thumSlider);
		main.sync(thumbnails);
		main.mount();
		thumbnails.mount();
	});
</script>

<svelte:head>
	<meta name="geo.placename" content={entry.section} />
	<meta name="geo.position" content="{entry.data?.coordinates[0]};{entry.data?.coordinates[1]}" />
</svelte:head>

<article>
	<header>
		<time datetime={entry.datetime}>{entry.localeDatetime}</time>
		<address>{entry.section}</address>
		<h1>{@html entry.title}</h1>
	</header>
	<section class="pictures">
		{#if browser}
			<div class="splide" id="main-slider">
				<div class="splide__track">
					<ul class="splide__list">
						{#each pictures as { filename, title, text }}
							<li class="splide__slide">
								<figure>
									<img
										class="main-image"
										src={`https://pics.fritsjen.de/blog/${entry.pictureFolder}/${filename}`}
										{title}
										alt={text}
									/>
									<figcaption>{text}</figcaption>
								</figure>
							</li>
						{/each}
					</ul>
				</div>
			</div>
			<div class="splide" id="thumbnail-slider">
				<div class="splide__track">
					<ul class="splide__list">
						{#each pictures as { filename, title, text }}
							<li class="splide__slide">
								<img
									src={`https://pics.fritsjen.de/blog/${entry.pictureFolder}/${filename}`}
									{title}
									alt={text}
								/>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}
	</section>
	<section class="main-content">
		{@html entry.text}
	</section>
</article>

<style lang="scss">
	article {
		margin-bottom: 15px;
	}
	address {
		font-size: 0.8em;
	}

	figure {
		margin: 0;
		padding: 0;
	}

	figcaption {
		margin: 10px 0;
		font-style: italic;
	}

	section {
		margin: 10px;
	}

	.splide__slide {
		opacity: 0.3;
	}

	:global(#main-slider .splide__slide) {
		text-align: center;
	}

	:global(.splide__slide.is-active) {
		opacity: 1;
	}
	:global(.splide__slide img.main-image) {
		margin-top: 5px;
		max-width: 97%;
		filter: brightness(0.9) contrast(1.2);
	}
</style>
