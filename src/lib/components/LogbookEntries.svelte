<script type="ts">
	import type { Feature } from 'ol';
	import type Geometry from 'ol/geom/Geometry';

	export let features: Feature<Geometry>[];
	export let update: Function;

	const handleClick = (e: UIEvent) => {
		update(e.target['id']);
	};
</script>

{#each features as f}
	<time datetime={f.get('datetime')}>{f.get('localeDatetime')}</time>
	<address>{f.get('section')}</address>
	<h3 on:click={handleClick} id={f.get('id')}>{@html f.get('title')}</h3>
{/each}

<style lang="scss">
	h3 {
		text-decoration: underline;
		cursor: pointer;
	}
</style>
