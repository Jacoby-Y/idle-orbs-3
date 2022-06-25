<script>
	import { addComp, toTitle } from "../lib/funcs.js";
	import { orbs, rarity_key, traits, trait_key, calcTrait, cash, dust, addNewOrb } from "../stores.js";

	const clickOrb = ({target}, orb)=>{
		const is_socket = target.classList.contains("socket");
		if (orb == sel_orb && !is_socket && socket_i < 0) {
			sel_orb = null;
			socket_i = -1;
			return;
		}
		sel_orb = orb;
		if (is_socket) {
			const i = [].slice.call(target.parentElement.children).indexOf(target);
			// console.log(`Selected socket ${i}!`);
			socket_i = i;
		} else {
			socket_i = -1;
		}
	}
	const swapSocket = (i)=>{
		const swap = $traits[i];
		$traits.splice(i, 1); 
		if (sel_socket != "") $traits.push(sel_socket);
		$traits = $traits;
		sel_orb.sockets[socket_i] = swap;
		$orbs = $orbs;
	}
	const removeSocket = ()=>{
		if (sel_socket == "") return;
		$traits = [ ...$traits, sel_socket];
		sel_orb.sockets[socket_i] = "";
		$orbs = $orbs;
	}
	const scrapOrb = (orb=null)=>{
		if (orb != null) sel_orb = orb;
		if ($orbs.length <= 1) return;
		$dust += rarity_key[sel_orb?.rarity].scrap_value;
		sel_orb.sockets.forEach(s => s != "" && $traits.push(s));
		$orbs.splice($orbs.indexOf(sel_orb), 1);
		$orbs = $orbs;
		sel_orb = null;
		socket_i = -1;
	}

	let sel_orb = null;
	let socket_i = -1;
	$: sel_socket = sel_orb?.sockets[socket_i];

	// $: console.log(trait_key[sel_socket]);
	
</script>

<main>
	<div id="orbs-wrapper" style={sel_orb == null ? "" : "height: calc(65%);"}>
		<div id="orbs">
			{#each $orbs as orb, i}
				<div class="orb-card" class:sel={sel_orb == orb} on:click={(ev)=> clickOrb(ev, orb)} on:dblclick={()=> scrapOrb(orb)}>
					<h3 class="count">{i+1}</h3>
					<div class="img" style="background-color: {rarity_key[orb.rarity].color};"></div>
					<div class="sockets">
						{#each orb.sockets as socket, j}
							<img class="socket" class:transp={socket == ""} class:sel={sel_orb == orb && socket_i == j} src="/src/assets/{socket == "" ? "default" : socket}.svg" alt="{sel_socket}">
						{/each}
					</div>
					{#if i == 1} <p id="scrap-hint">Double Click to Quickly Scrap</p> {/if}
				</div>
				{/each}
				<!-- <div id="buy-card">
					<div id="buy-orb-btn">Buy orb<br><span on:click={buyCashOrb}>${new_orb_cost.cash}</span> or <span on:click={buyDustOrb}>{new_orb_cost.dust}Đ</span></div>
				</div> -->
		</div>
	</div>
	{#if sel_orb != null && socket_i < 0}
		<div id="orb-info">
			<h2>Rarity: {sel_orb?.rarity}</h2>
			<h2>Value: {calcTrait.value(sel_orb)}</h2>
			<button id="scrap-btn" on:click={scrapOrb}>Scrap for {rarity_key[sel_orb?.rarity].scrap_value}Đ (Dust)</button>
		</div>
	{:else if sel_orb != null && socket_i >= 0}
		<div id="socket-info">
			<div id="current">
				<img  class:transp={sel_socket == ""} src="/src/assets/{sel_socket == "" ? "default" : sel_socket}.svg" alt="{sel_socket}" on:click={()=> removeSocket()}>
				<h2 id="current-info">
					{!sel_socket ? "None" : toTitle(sel_socket)} <br>
					<span>{!sel_socket ? "..." : trait_key[sel_socket]?.desc}</span>
				</h2>
			</div>
			<div id="socket-list" style="grid-template-columns: repeat({$traits.length}, max-content);">
				{#each $traits as trait, i}
					<img class="socket" src="/src/assets/{trait}.svg" alt="{trait}" on:click={()=> swapSocket(i)}>
				{/each}
			</div>
		</div>
	{/if}
</main>

<style>
	main {
		width: 100%;
		height: 839px; /* calc(100% - 2rem); */
		/* max-height: 692px; */
		color: white;
		position: relative;
		/* border-bottom: 1px solid lime; */
	}
	#orbs-wrapper {
		height: 100%;
		/* max-height: 900px; */
		overflow-y: scroll;
		overflow-x: hidden;
	}
	#orbs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-auto-rows: max-content;
		overflow-x: hidden;
		width: calc(100% - 1.1rem);
		height: max-content;
		gap: 1rem;
		padding: 1rem;
	}
	.orb-card {
		/* border: 1px solid red; */
		position: relative;
		background-color: #333;
		display: grid;
		grid-template-columns: max-content 1fr;
		grid-template-rows: 1fr;
		justify-items: center;
		align-items: center;
		padding: 1rem;
		gap: 2rem;
		cursor: pointer;
	}
	#scrap-hint {
		position: absolute;
		right: 0;
		bottom: 0;
		color: grey;
		font-size: 1.1rem;
		padding: 0.5rem 0.7rem;
	}
	.orb-card .count {
		position: absolute;
		left: 0;
		top: 0;
		padding: 0.7rem 0.9rem;
	}
	.orb-card:hover {
		border: 1px solid #505050;
		margin: -1px;
	}
	.orb-card.sel {
		/* box-shadow: 0 0 4px white; */
		border: 1px dashed white;
		margin: -1px;
	}
	.orb-card .img {
		height: 10rem;
		width: 10rem;
		border-radius: 50%;
	}
	.orb-card .sockets {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		justify-items: center;
		align-items: center;
		width: 100%;
		height: max-content;
		padding: 1rem;
		gap: 1rem;
	}
	.sockets .socket {
		width: 3rem;
		height: 3rem;
		/* border: 1px solid pink; */
		background-color: #444;
	}
	.sockets .socket.sel {
		/* box-shadow: 0 0 2px white; */
		border: 1px solid white;
		margin: -1px;
	}
	.sockets .socket:nth-child(odd) {
		justify-self: right;
	}
	.sockets .socket:nth-child(even) {
		justify-self: left;
	}
	.sockets .socket:hover {
		background-color: #555;
	}
	#orb-info:not(.hidden) {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		align-items: center;
		justify-items: center;
	}
	#orb-info #scrap-btn {
		border: none;
		border-radius: 0;
		background-color: #494949;
		color: white;
		font-weight: bold;
		font-size: 1.3rem;
		padding: 1rem 1.2rem;
		cursor: pointer;
	}
	#orb-info #scrap-btn:hover {
		background: #555;
	}
	#orb-info, #socket-info {
		/* border-top: 1px solid grey; */
		background-color: #393939;
		color: white;
		padding: 1rem;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 30%;
	}
	#socket-info:not(.hidden) {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr;
		align-items: center;
		justify-items: center;
		width: calc(100% - 2rem);
	}
	#socket-info img {
		/* border: 1px solid red; */
		width: 5rem;
		height: 5rem;
		cursor: pointer;
		background-color: #4a4a4a;
	}
	#socket-info #socket-list {
		display: grid;
		grid-template-rows: 1fr;
		gap: 1rem;
		/* justify-content: center; */
		/* max-width: 90%; */
		width: calc(100% - 2rem);
		padding: 1rem;
		overflow-x: scroll;
		border-left: 1px solid #303030;
		border-right: 1px solid #303030;
		background-color: #303030;
	}
	#socket-info #current {
		display: grid;
		grid-template-columns: 1fr 1fr;
		justify-items: center;
		width: 60%;
	}
	#current-info span {
		font-weight: normal;
	}

	.hidden {
		display: none;
	}
	.transp {
		opacity: 0.7;
	}

</style>