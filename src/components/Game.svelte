<script>
	import { onMount } from "svelte";
	import { timer, ctx, size, cash, coll_rad, auto_bounce, dust, traits, addNewOrb, addNewTrait } from "../stores.js";
	import draw from '../lib/draw.js'
	import { OrbM } from "../lib/orbs.js";

	//#region | Canvas
	/** <main> holding all html of the game (not shop) */
		let main;
	/** @type {HTMLCanvasElement}*/
	let canvas;
	/** Causes main_loop to not run if true */
	let pause = false;
	/** If paused is true: then it runs main_loop once and goes back to being paused */
	let step = false;
	/** Background color of the canvas */
	const background_color = "#3c5b5f";
	let w, h;
	//#endregion
	
	const main_loop = (tick)=>{
		if (pause && step == false) return;
		if (step == true) step = false;

		draw.rect(0,0, w,h, background_color);

		draw.rect(0, h-$auto_bounce.size, w, $auto_bounce.size, "#005555");
		draw.rect(0, h-($auto_bounce.size*($auto_bounce.prog/$auto_bounce.max)), w, $auto_bounce.size, "#005c5c");

		if ($auto_bounce.unlocked) {
			$auto_bounce.prog++;
			if ($auto_bounce.prog >= $auto_bounce.max) {
				OrbM.bounce(true);
				$auto_bounce.prog = 0;
			}
			$auto_bounce = $auto_bounce;
		}
		
		OrbM.update();

		draw.circle(w/2, h/3, 10, "#aa9900");
		draw.circle(w/2, h/3, $coll_rad, "#aa9900", false, 3);
		draw.circle(w/2, h/3, $coll_rad, "#aaaa0022");
	}

	onMount(()=>{
		$ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });

		$ctx.scale(1, 2);
		
		w = size.w = canvas.width = 1600/2;
		h = size.h = canvas.height = 900;

		timer.subscribe(main_loop);
		
		document.body.onkeydown = ({ key })=>{
			if (key == " ") pause = !pause;
			else if (key == "s") step = true;
			else if (key == "i") console.log(OrbM.info);
			else if (key == "0") $cash = 0;
			else if (key == "m") $cash += 50;
			else if (key == "d") $dust += 50;
			else if (key == "p") console.log(OrbM.phys);
			else if (key == "t") console.log($traits);
			else if (key == "1") Array.from(Array(10)).forEach(()=> addNewOrb());
			else if (key == "2") Array.from(Array(10)).forEach(()=> addNewTrait());
		}

		canvas.onmousedown = (ev)=>{
			OrbM.mouse_x = ev.offsetX;
			OrbM.bounce();
		}
	});
</script>

<canvas bind:this={canvas} bind:clientWidth={w} bind:clientHeight={h}> </canvas>

<style>
	canvas {
		cursor: pointer;
	}
</style>