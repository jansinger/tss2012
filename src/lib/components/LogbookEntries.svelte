<script type="ts">
	import type { LogEntryShort } from '$lib/types';

	export let entries: LogEntryShort[];
	export let update: Function = () => {};

	let sortedEntries = entries.sort(
		(a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
	);

	const handleClick = (id: string) => {
		return () => update(id);
	};
</script>

{#each sortedEntries as f}
	<article on:click={handleClick(f.id)}>
		<div class="img-container">
			<img src="/images/{f.picture}" title={f.pictureTitle} alt={f.pictureTitle} />
		</div>
		<div class="text-container">
			<time datetime={f.datetime}>{f.localeDatetime}</time>
			<address>{f.section}</address>
			<p>{@html f.title}</p>
		</div>
	</article>
{/each}

<style lang="scss">
	article {
		background-color: #666666;
		color: #efefef;
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
		background-color: #888888;
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
	@media screen and (max-width: 700px) {
		article .img-container {
			width: 100px;
			height: 100%;
		}
		article .img-container img {
			height: 75px;
			max-width: 100px;
		}
		article .text-container {
			padding: 5px;
			font-size: 0.75em;
		}
		article p {
			font-weight: bold;
		}
	}
</style>
