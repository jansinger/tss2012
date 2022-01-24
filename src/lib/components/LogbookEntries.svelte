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
		<div class="img-container">
			<img
				src="https://pics.fritsjen.de/blog/{f.get('picture')}"
				title={f.get('pictureTitle')}
				alt={f.get('pictureTitle')}
			/>
		</div>
		<div class="text-container">
			<time datetime={f.get('datetime')}>{f.get('localeDatetime')}</time>
			<address>{f.get('section')}</address>
			<p>{@html f.get('title')}</p>
		</div>
	</article>
{/each}

<style lang="scss">
	article {
		background-color: #efefef;
		border-radius: 0.5em;
		padding: 0;
		margin: 5px;
		cursor: pointer;
		float: left;
		width: calc(100% - 30px);
		max-height: 150px;
	}
	article::before {
		clear: both;
	}

	article:hover {
		background-color: #dfdfdf;
	}
	article .img-container {
		width: 200px;
		text-align: center;
		margin-right: 10px;
		float: left;
	}
	article .img-container img {
		height: 150px;
		max-width: 200px;
		text-align: center;
		margin-right: 10px;
		float: left;
		border-radius: 0.5em 0 0 0.5em;
	}
	article .text-container {
		padding: 10px;
	}
	article p {
		font-weight: bold;
	}
</style>
