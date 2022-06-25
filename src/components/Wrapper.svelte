<script>
	import { fNum } from "../lib/funcs.js";
	import { cash, dust } from "../stores.js";
	import Orbs from "./Orbs.svelte";
	import Shop from "./Shop.svelte";
	import Traits from "./Traits.svelte";

	let nav_i = 0;
	const nav_list = ["Orbs", "Shop", "Traits", "Prestige", "Settings"];
	const comp_list = [ Orbs, Shop, Traits ];
</script>

<main>
	<h3 id="cash-txt">${fNum($cash)}<br>{fNum($dust)}Đ</h3>
	<nav>
		{#each nav_list as nav, i}
			<h2 on:click={()=> nav_i = i} class:selected={nav_i == i}>{nav}</h2>
		{/each}
	</nav>
	<svelte:component this={comp_list[nav_i]} />
</main>

<style>
	main {
		width: 100%;
		height: 900px;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: max-content 1fr;
	}
	nav {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: max-content;
	}
	nav h2 {
		position: relative;
		top: 0;
		color: white;
		padding: 1rem;
		border-bottom: 2px solid grey;
		cursor: pointer;
		transition-duration: 0.3s;
	}
	nav h2:not(.selected):hover {
		top: 0.5rem;
		border-bottom-left-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
	}
	nav h2.selected {
		cursor: auto;
		background-color: #333;
	}

	#cash-txt {
		position: absolute;
		left: 0;
		top: 0;
		padding: 0.8rem 1.2rem;
		color: white;
		line-height: 2rem;
		font-size: 1.5rem;
		text-align: left;
	}
</style>