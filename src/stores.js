import { get, writable } from "svelte/store";
import { randRange } from "./lib/funcs.js";

let deci = 0;
export const dust = writable(0);
export const cash = writable(0);
cash.subscribe((v)=>{
	if (v < 0) { cash.set(0); return; }
	if (Math.floor(v) == v) return;
	deci += v - Math.floor(v);
	if (deci >= 1) {
		v += Math.floor(deci);
		deci -= Math.floor(deci);
		cash.set(Math.floor(v));
	} else {
		cash.set(Math.floor(v));
	}
});
export const timer = writable(0);
export const tps = 45;

const run_timer = ()=> timer.update(v => (v+1)%tps);
let timer_interval = setInterval(run_timer, 1000/tps);

/** @type {CanvasRenderingContext2D}*/ let _ctx;
export const ctx = writable(_ctx);

export const size = { w: 1600, h: 900 };

export const auto_bounce = writable({
	prog: 0,
	// max: 20,
	max: tps*3,
	unlocked: false,
	unlock_cost: 100,
	size: 100,
	speed_cost: 100,
	size_cost: 100,
});

export const render_mode = writable(0);

export const collect_radius = writable(100);

export const orbs = writable([
	{ rarity: "common", value: 1, sockets: [] },
	// { rarity: "uncommon", value: 2, sockets: ["", ""] },
	// { rarity: "rare", value: 3, sockets: ["", "", "", ] },
	// { rarity: "epic", value: 4, sockets: ["", "", "", "", ] },
	// { rarity: "legendary", value: 5, sockets: ["", "", "", "", "", ""] },
	// { rarity: "magic", value: 6, sockets: ["", "", "", "", ""] },
]);
export const traits = writable([ ]);
export const rarity_key = {
	common: {
		scrap_value: 5,
		chance: 40,
		color: "white",
		get_value: ()=> randRange(1,1),
		get_sockets: ()=> randRange(0, 1),
	}, 
	uncommon: {
		scrap_value: 10,
		chance: 20,
		color: "lime",
		get_value: ()=> randRange(2,5),
		get_sockets: ()=> randRange(1, 2),
	}, 
	rare: {
		scrap_value: 20,
		chance: 15,
		color: "aqua",
		get_value: ()=> randRange(5,10),
		get_sockets: ()=> randRange(2, 3),
	}, 
	epic: {
		scrap_value: 40,
		chance: 10,
		color: "violet",
		get_value: ()=> randRange(10,15),
		get_sockets: ()=> randRange(3, 4),
	}, 
	legendary: {
		scrap_value: 70,
		chance: 5,
		color: "gold",
		get_value: ()=> randRange(15,20),
		get_sockets: ()=> randRange(4, 5),
	}, 
	magic: {
		scrap_value: 50,
		chance: 10,
		color: "pink",
		get_value: ()=> randRange(5,30),
		get_sockets: ()=> randRange(1, 6),
	}
};
const new_trait = (desc, weight)=>{return {desc, weight} }
export const trait_key = {
	helium: new_trait("Orb is lighter.", 15),
	ice: new_trait("Orb takes less drag", 15),
	midas: new_trait("Orb value increases by $3.", 5),
	magnetic: new_trait("Orb is attracted to the collector.", 1),
};
const total_trait_weight = Object.keys(trait_key).reduce((p, c)=> p+trait_key[c].weight, 0);
export const trait_cost = {
	cash: 50,
	dust: 10,
}
export const addNewTrait = ()=>{
	const rand = randRange(0, total_trait_weight);
	let new_t = "midas";
	Object.keys(trait_key).reduce((p, c)=> {
		const res = p+trait_key[c].weight;
		if (rand >= p && rand < res) new_t = c;
		return res;
	}, 0);
	traits.update(v => [...v, new_t]);
}

export const addNewOrb = ()=>{
	let perc = Math.round(Math.random()*100);
	const [r, obj] = (()=>{
		for (const k in rarity_key) {
			if (!Object.hasOwnProperty.call(rarity_key, k)) continue;
			const v = rarity_key[k];
			perc -= v.chance;
			if (perc <= 0) return [k, v];
		}
	})()
	const new_orb = { rarity: "common", value: 1, sockets: [] };
	new_orb.rarity = r;
	new_orb.value = obj.get_value();
	new_orb.sockets = Array.from(Array(obj.get_sockets())).map(()=> "");

	orbs.update(v => [ ...v,  new_orb]);
}
export const coll_rad = writable(200);

window.onbeforeunload = ()=>{
	clearInterval(timer_interval);
}

export const calcTrait = {
	value(orb) {
		if (!orb) return;
		return orb.value + orb.sockets.reduce((p,c)=> c == "midas" ? p+1 : p, 0) * 3;
	},
	lessDrag(orb) {
		if (!orb) return;
		return orb.sockets.reduce((p,c)=> c == "ice" ? p+1 : p, 0);
	},
	lessGravity(orb) {
		if (!orb) return;
		return orb.sockets.reduce((p,c)=> c == "helium" ? p+1 : p, 0);
	},
	magnetic(orb) {
		if (!orb) return;
		return orb.sockets.reduce((p,c)=> c == "magnetic" ? p+1 : p, 0);
	}
};


// const array = [ true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true ];
// const detectCosmicRay = ()=>{
// 	while (!array.includes(false)) {}
// 	console.log("Detected cosmic ray!");
// }

// detectCosmicRay