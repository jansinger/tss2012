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
		}
	};

	const modalClosed = () => {
		feature = null;
	};
</script>

<nav class="main-navigation">
	<div class="item-wrapper">
		<a href="/timeline" title="Zeitleiste"><i class="fas fa-calendar-alt" /></a>
	</div>
</nav>

<LoogbookMap on:clickLogbook={clickLogbook} />

{#if browser}
	<Modal on:closed={modalClosed}>
		<ModalContent {feature} />
	</Modal>
{/if}
