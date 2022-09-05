<script type="ts">
	import { afterUpdate, beforeUpdate } from 'svelte';
	import { browser } from '$app/environment';
	import type { Splide, Options } from '@splidejs/splide';
	import type { PicturesEntity } from '$lib/types';
	import { stripHtml } from '$lib/utils/striphtml';
	import { fly } from 'svelte/transition';

	type SplideConstructor = new (target: string | HTMLElement, options?: Options) => Splide;

	export let pictures: PicturesEntity[] = [];
	export let folder: string;

	let splide: SplideConstructor, main: Splide, thumbnails: Splide;

	const splideOptions = {
		type: 'fade',
		pagination: false,
		arrows: false
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

	beforeUpdate(() => {
		main?.destroy();
		thumbnails?.destroy();
	});

	afterUpdate(async () => {
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

	let block = false;
</script>

{#if browser}
	<div class="splide" id="main-slider">
		<div class="splide__track">
			<ul class="splide__list">
				{#each pictures as { filename, title, text, sizebig }}
					<li class="splide__slide">
						<figure>
							<img
								class="main-image"
								src={`/images/${folder}/${filename}`}
								{title}
								alt={stripHtml(text)}
								width={sizebig?.width}
								height={sizebig?.height}
								loading="lazy"
								transition:fly
							/>
							<figcaption>{@html text}</figcaption>
						</figure>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="splide" id="thumbnail-slider">
		<div class="splide__track">
			<ul class="splide__list">
				{#each pictures as { filename, title, text, sizebig }}
					<li class="splide__slide">
						<img
							src={`/images/${folder}/${filename}`}
							{title}
							alt={stripHtml(text)}
							width={sizebig?.width}
							height={sizebig?.height}
							loading="lazy"
							transition:fly
						/>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}

<style lang="scss">
	figure {
		margin: 0;
		padding: 0;
	}

	figcaption {
		margin: 10px 0;
		font-style: italic;
	}

	:global(.splide__slide) {
		opacity: 0.6;
	}

	:global(#main-slider .splide__slide) {
		text-align: center;
	}

	:global(.splide__slide.is-active) {
		opacity: 1;
	}
	:global(.splide__slide img.main-image) {
		margin-top: 5px;
		object-fit: contain;
		max-width: 100%;
		filter: contrast(1.2);
	}
</style>
