<script type="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { browser } from '$app/env';

	export let entry: Record<string, any> = {};
	let pictures: Array<Record<string, any>> = [];
	let Splide, main, thumbnails;

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
		gap: 10,
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
		pictures = entry.pictures;

		console.log('the component just updated');
		if (!Splide) {
			const module = await import('@splidejs/splide');
			Splide = module.Splide;
		}
		main = new Splide('#main-slider', splideOptions);
		thumbnails = new Splide('#thumbnail-slider', thumSlider);
		main.sync(thumbnails);
		main.mount();
		thumbnails.mount();
	});
</script>

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
										src={`https://pics.fritsjen.de/blog/${entry.pictureFolder}/${filename.replace(
											'.jpg',
											'_gr.jpg'
										)}`}
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
	<footer>
		<p />
	</footer>
</article>

<style lang="scss">
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

	.splide__slide {
		opacity: 0.3;
	}

	:global(#main-slider .splide__slide) {
		text-align: center;
	}

	:global(.splide__slide.is-active) {
		opacity: 1;
	}
	:global(.splide__slide img) {
		max-width: 100%;
	}
</style>
