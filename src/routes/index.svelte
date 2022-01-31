<script type="ts" context="module">
	export const prerender = true;
</script>

<script type="ts">
	import ModalContent from '$lib/components/ModalContent.svelte';
	import LoogbookMap from '$lib/components/LogbookMap.svelte';
	import Modal from 'svelte-simple-modal';
	import { browser } from '$app/env';
	import type Geometry from 'ol/geom/Geometry';
	import type Feature from 'ol/Feature';
	import { goto } from '$app/navigation';

	let feature: Feature<Geometry>;

	const clickLogbook = (e: CustomEvent) => {
		//feature = e.detail.feature;
		const f = e.detail.feature;
		const features = f.get('features');
		if (features.length === 1) {
			goto(`/log/${features[0].get('id')}`);
		} else {
			feature = f;
		}
	};

	const modalClosed = () => {
		feature = null;
	};
</script>

<svelte:head>
	<title>Karte der Segelreise</title>
	<link rel="canonical" href="https://www.ein-tierischer-segelsommer.de/" />
</svelte:head>

<nav class="main-navigation">
	<div class="tss-navigation ol-unselectable ol-control" style="pointer-events: auto;">
		<button
			type="button"
			aria-expanded="false"
			title="Zeitleiste"
			on:click={() => goto('/timeline')}
		>
			<i class="fas fa-calendar-alt" />
		</button>
	</div>
</nav>

<LoogbookMap on:clickLogbook={clickLogbook} />

{#if browser}
	<Modal on:closed={modalClosed}>
		<ModalContent {feature} />
	</Modal>
{/if}
