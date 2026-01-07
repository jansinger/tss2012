<script lang="ts">
    import { browser } from '$app/environment';
    import type { PicturesEntity } from '$lib/types';
    import { stripHtml } from '$lib/utils/striphtml';

    /**
     * Represents the properties for the Pictures component.
     * @typedef {Object} Props
     * @property {PicturesEntity[]} [pictures=[]] - An optional array of PicturesEntity objects representing the images to be displayed.
     * @property {string} folder - The folder path where the images are stored.
     */
    interface Props {
        pictures?: PicturesEntity[];
        folder: string;
    }

    /**
     * Initializes the component props with default values.
     * @type {Props}
     */
    let { pictures = [], folder }: Props = $props();

    // Track if Swiper has been registered
    let swiperReady = $state(false);

    // Lazy-load Swiper registration only when component mounts in browser
    $effect(() => {
        if (browser && !swiperReady) {
            import('swiper/element/bundle').then(({ register }) => {
                register();
                swiperReady = true;
            });
        }
    });
</script>

{#if browser && swiperReady}
	<p id="gallery-help" class="visually-hidden">
		Verwenden Sie die Pfeiltasten links/rechts oder die Navigationspfeile, um durch die Bilder zu blättern.
	</p>

	<swiper-container
		class="mySwiper"
		style="--swiper-navigation-color: #fff; --swiper-pagination-color: #fff"
		slides-per-view="1"
		navigation={true}
		pagination={false}
		centered-slides={true}
		centered-slides-bounds={true}
		effect="coverflow"
		thumbs-swiper=".mySwiper2"
		auto-height={true}
		loop={false}
		keyboard={{ enabled: true, onlyInViewport: false }}
		a11y={{ enabled: true }}
		role="region"
		aria-label="Bildergalerie"
		aria-describedby="gallery-help"
		>
		{#each pictures as { filename, title, text, sizebig }, index}
			<swiper-slide role="group" aria-label="Bild {index + 1} von {pictures.length}">
				<figure>
					<img
						class="main-image"
						src={`/images/${folder}/${filename}`}
						{title}
						alt={stripHtml(text)}
						width={sizebig?.width}
						height={sizebig?.height}
					/>
					<!--
						@html is used for formatted image captions from static JSON.
						Data source: src/lib/data/logbook.json (trusted static content)
					-->
					<figcaption>{@html text}</figcaption>
				</figure>
			</swiper-slide>
		{/each}
	</swiper-container>
	<!-- thumbs swiper -->
	<swiper-container class="mySwiper2"
		style="--swiper-pagination-top: 90px"
		space-between="5"
		slides-per-view="10"
		free-mode={true}
    	watch-slides-progress={true}
		pagination={true}
		pagination-clickable={true}
		role="list"
		aria-label="Bildvorschauen">
		{#each pictures as { filename, title, text, sizebig }}
			<swiper-slide role="listitem">
				<img
					class="main-image"
					src={`/images/${folder}/${filename}`}
					{title}
					alt=""
					aria-hidden="true"
					width={sizebig?.width}
					height={sizebig?.height}
					/>
			</swiper-slide>
		{/each}
	</swiper-container>
{/if}

<style lang="scss">
	figure {
		margin: 0;
		padding: auto 0;
		width: 100%;

		img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	figcaption {
		margin: 10px 0;
		font-style: italic;
	}

	swiper-container {
		width: 100%;
		height: 300px;
		margin-left: auto;
		margin-right: auto;
	}

	swiper-slide {
		text-align: center;
		font-size: 18px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-size: cover;
		background-position: center;

		img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.mySwiper {
		height: 80%;
		width: 100%;
	}

	.mySwiper2 {
		height: 20%;
		box-sizing: border-box;
		padding: 10px 0;

		swiper-slide {
			width: 25%;
			height: 100%;
			opacity: 0.4;
		}
	}

	:global(.swiper-slide-thumb-active) {
		opacity: 1 !important;
	}
</style>
