<script type="ts">
	import ModalContent from '$lib/components/ModalContent.svelte';
	import LoogbookMap from '$lib/components/LogbookMap.svelte';
	import Modal from 'svelte-simple-modal';
	import { browser } from '$app/env';

	let id: string;

	const clickLogbook = (e: CustomEvent) => {
		id = e.detail.feature.get('id');
	};
</script>

<LoogbookMap on:clickLogbook={clickLogbook} />

{#if browser}
	<Modal>
		<ModalContent {id} />
	</Modal>
{/if}
