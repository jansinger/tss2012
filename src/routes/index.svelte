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
		feature = e.detail.feature;
	};

	const modalClosed = () => {
		feature = null;
	};
</script>

<nav class="main-navigation">
	<div class="item-wrapper">
		<button title="Zeitleiste" on:click={() => goto('/timeline')}
			><i class="fas fa-calendar-alt" /></button
		>
		<button disabled title="Karte"><i class="fas fa-map-marked-alt" /></button>
	</div>
</nav>

<LoogbookMap on:clickLogbook={clickLogbook} />

{#if browser}
	<Modal on:closed={modalClosed}>
		<ModalContent {feature} />
	</Modal>
{/if}
