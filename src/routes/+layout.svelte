<script lang="ts">
	import LogbookMap from '$lib/components/LogbookMap.svelte';

	import { setContext } from 'svelte';

	import './_layout.scss';

	let isOpenOverlay = false;
	let clickHandler = () => {};
	const setClickHandler = (handler: () => void) => (clickHandler = handler);

	const set = (overlay: boolean) => (isOpenOverlay = overlay);

	setContext('map-overlay', { set, setClickHandler });
</script>

<main>
	<div class:noscroll={isOpenOverlay}>
		<LogbookMap on:clickLogbook={clickHandler} />
	</div>

	<slot />
</main>
