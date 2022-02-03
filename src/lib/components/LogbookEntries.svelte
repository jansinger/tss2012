<script type="ts">
	import type { LogEntryShort } from '$lib/types';

	export let entries: LogEntryShort[] = [];

	let sortedEntries: LogEntryShort[];

	$: {
		sortedEntries = entries.sort(
			(a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
		);
	}
</script>

{#each sortedEntries as f}
	<a href="/log/{f.id}" title={f.title}>
		<article>
			<div class="img-container">
				<img src="/images/{f.picture}" title={f.pictureTitle} alt={f.pictureTitle} />
			</div>
			<div class="text-container">
				<time datetime={f.datetime}>{f.localeDatetime}</time>
				<address>{f.section}</address>
				<p>{@html f.title}</p>
			</div>
		</article>
	</a>
{/each}

<style lang="scss">
	article {
		background-color: rgba(46, 98, 135, 1);
		color: #efefef;
		border-radius: 0.5em;
		padding: 0;
		margin: 5px;
		cursor: pointer;
		float: left;
		width: calc(100% - 30px);
		max-height: 150px;
		overflow: hidden;
	}
	article::before {
		clear: both;
	}

	article:hover {
		background-color: #2e6287;
		opacity: 1;
		.img-container img {
			opacity: 1;
		}
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
		filter: brightness(0.9) contrast(1.2);
		opacity: 0.6;
	}
	article .text-container {
		padding: 10px;
	}
	article p {
		line-height: 1.4;
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
	}
</style>
