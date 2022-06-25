<script>
	import { dust, traits } from "../stores";

	let scrapping = false;

	const clickTrait = (i)=>{
		if (!scrapping) return;
		traits.update(v => (v.splice(i, 1), v));
		$dust += 2;
	}

</script>

<main>
	<div id="trait-grid">
		<div id="scrap-toggle" on:click={()=> scrapping = !scrapping} style="background-color: {scrapping ? "#00b100" : "#b10000"};">
			Click<br>to<br>Scrap
		</div>
		{#each $traits.sort() as trait, i}
			<img class="socket" src="/src/assets/{trait}.svg" alt="{trait}" on:click={()=> clickTrait(i)}>
		{/each}
	</div>
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		overflow-y: scroll;
	}
	#trait-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 1rem;
		grid-auto-rows: max-content;
		height: calc(100% - 2rem);
		padding: 1rem;
		justify-items: center;
		align-items: center;
	}
	#trait-grid img, #scrap-toggle {
		width: 7rem;
		height: 7rem;
		cursor: pointer;
	}
	#scrap-toggle {
		display: grid;
		justify-content: center;
		align-content: center;
		font-weight: bold;
		color: white;
		font-size: 1.2rem;
	}
</style>