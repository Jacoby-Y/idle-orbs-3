<script>
  import { onMount } from "svelte";
  import Game from "./components/Game.svelte";
  import Wrapper from "./components/Wrapper.svelte";
  import { } from "./stores.js";

  //#region | Scale Game
  let main;
  const resize = ()=>{
    let scale = 1;
    const w = document.body.clientWidth;
    const h = document.body.clientHeight;
    if (w*0.5625 >= h) scale = h/900;
    else scale = w/1600;
    
    main.style.transform = `translate(-50%, -50%) scale(${scale}, ${scale})`;

    console.log("scaling!");
  }
  onMount(()=>{
		resize();
	});
	window.onresize = resize;
  //#endregion

</script>

<main bind:this={main}>
  <Game />
  <Wrapper />
</main>

<style>
  main {
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 1600px;
    height: 900px;
    overflow: hidden;
    clip-path: inset(0 0 0 0);
    background-color: #202020;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }
</style>
