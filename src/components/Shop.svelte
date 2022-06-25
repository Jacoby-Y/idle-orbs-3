<script>
	import { addComp } from "../lib/funcs";
	import { addNewOrb, cash, dust, orbs, trait_key, addNewTrait, trait_cost, auto_bounce } from "../stores";

	$: new_orb_cost = { cash: addComp(20, $orbs.length, 20), dust: addComp(5, $orbs.length, 5) };

	const buyCashOrb = ()=>{
		if ($cash < new_orb_cost.cash) return;
		$cash -= new_orb_cost.cash;
		addNewOrb();
	}
	const buyDustOrb = ()=>{
		if ($dust < new_orb_cost.dust) return;
		$dust -= new_orb_cost.dust;
		addNewOrb();
	}

	const buyCashTrait = ()=>{
		if ($cash < trait_cost.cash) return;
		$cash -= trait_cost.cash;
		addNewTrait();
	}
	const buyDustTrait = ()=>{
		if ($dust < trait_cost.dust) return;
		$dust -= trait_cost.dust;
		addNewTrait();
	}
	const unlockAutoBounce = ()=>{
		if ($cash < $auto_bounce.unlock_cost) return;
		$cash -= $auto_bounce.unlock_cost;
		$auto_bounce.unlocked = true;
		$auto_bounce = $auto_bounce;
	}
	const upgradeBounceSpeed = ()=>{
		if ($cash < $auto_bounce.speed_cost) return;
		$cash -= $auto_bounce.speed_cost;
		$auto_bounce.max = Math.round($auto_bounce.max * 0.95);
		$auto_bounce = $auto_bounce;
	}
</script>

<main>
	<h2 class="buy-wrapper-btn">Buy Orb: <span on:click={buyCashOrb}>${new_orb_cost.cash}</span> or <span on:click={buyDustOrb}>{new_orb_cost.dust}Đ</span></h2>
	<h2 class="buy-wrapper-btn">Buy Orb Trait: <span on:click={buyCashTrait}>${trait_cost.cash}</span> or <span on:click={buyDustTrait}>{trait_cost.dust}Đ</span></h2>
	{#if $auto_bounce.unlocked}
		<h2 class="buy-btn" on:click={upgradeBounceSpeed}>Auto Bounce Speed: ${$auto_bounce.speed_cost}</h2>
	{:else}
		<h2 class="buy-btn" on:click={unlockAutoBounce}>Unlock Auto Bounce: ${$auto_bounce.unlock_cost}</h2>
	{/if}
</main>

<style>
	main {
		width: calc(100% - 2rem);
		height: calc(100% - 2rem);
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-rows: max-content;
		gap: 1rem;
		color: white;
		padding: 1rem;
	}
	.buy-btn {
		background-color: #333;
		padding: 1rem;
		cursor: pointer;
	}
	.buy-btn:hover {
		background-color: #393939;
	}
	.buy-wrapper-btn {
		background: #333;
		padding: 1rem;
	}
	.buy-wrapper-btn span {
		background-color: #444;
		padding: 0.5rem;
		cursor: pointer;
	}
	.buy-wrapper-btn span:hover {
		background-color: #505050;
	}
</style>