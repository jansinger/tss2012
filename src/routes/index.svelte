<script type="ts">
	import ModalContent from '$lib/components/ModalContent.svelte';
	import LoogbookMap from '$lib/components/LogbookMap.svelte';
	import Modal from 'svelte-simple-modal';
	import { browser } from '$app/env';

	let id: string;

	const clickLogbook = (e: CustomEvent) => {
		const features = e.detail.feature.get('features');
		if (features.length === 1) {
			id = features[0].get('id');
		}
	};

	const modalClosed = () => {
		id = null;
	};
</script>

<LoogbookMap on:clickLogbook={clickLogbook} />

{#if browser}
	<Modal on:closed={modalClosed}>
		<ModalContent {id} />
	</Modal>
{/if}
