<script type="ts">
	import ModalContent from '$lib/components/ModalContent.svelte';
	import LoogbookMap from '$lib/components/LogbookMap.svelte';
	import Modal from 'svelte-simple-modal';
	import { browser } from '$app/env';
	import type Geometry from 'ol/geom/Geometry';
	import type Feature from 'ol/Feature';

	let feature: Feature<Geometry>;

	const clickLogbook = (e: CustomEvent) => {
		feature = e.detail.feature;
	};

	const modalClosed = () => {
		feature = null;
	};
</script>

<LoogbookMap on:clickLogbook={clickLogbook} />

{#if browser}
	<Modal on:closed={modalClosed}>
		<ModalContent {feature} />
	</Modal>
{/if}
