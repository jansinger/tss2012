<script type="ts">
	import type { Feature } from 'ol';
	import type Geometry from 'ol/geom/Geometry';

	export let features: Feature<Geometry>[];
	export let update: Function;

	let sortedEntries = features.sort(
		(a, b) => new Date(a.get('datetime')).getTime() - new Date(b.get('datetime')).getTime()
	);

	const handleClick = (id: string) => {
		return () => update(id);
	};
</script>

{#each sortedEntries as f}
	<article on:click={handleClick(f.get('id'))}>
		<time datetime={f.get('datetime')}>{f.get('localeDatetime')}</time>
		<address>{f.get('section')}</address>
		<p>{@html f.get('title')}</p>
	</article>
{/each}

<style lang="scss">
	article {
		background-color: #efefef;
		padding: 10px;
		margin: 5px;
		cursor: pointer;
	}
	article:hover {
		background-color: #dfdfdf;
	}
	p {
		font-weight: bold;
	}
</style>
