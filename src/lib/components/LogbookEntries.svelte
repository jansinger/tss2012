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
		<img
			src="https://pics.fritsjen.de/blog/{f.get('picture')}"
			title={f.get('pictureTitle')}
			alt={f.get('pictureTitle')}
		/>
		<time datetime={f.get('datetime')}>{f.get('localeDatetime')}</time>
		<address>{f.get('section')}</address>
		<p>{@html f.get('title')}</p>
	</article>
{/each}

<style lang="scss">
	article {
		background-color: #efefef;
		border-radius: 0.5em;
		padding: 10px;
		margin: 5px;
		cursor: pointer;
		float: left;
		width: calc(100% - 30px);
	}
	article::before {
		clear: both;
	}

	article:hover {
		background-color: #dfdfdf;
	}
	article img {
		float: left;
		margin-right: 5px;
	}
	article p {
		font-weight: bold;
	}
</style>
