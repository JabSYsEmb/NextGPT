<script>
  import RadialProgressIndicator from "./radial-progress-indicator.svelte";

  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";

  /**@type {number}*/
  export let total;
  /**@type {import('svelte/store').Writable<number>}*/
  export let progress;

  const percentage = tweened($progress / total, {
    duration: 1000,
    easing: cubicOut,
  });

  progress.subscribe((v) => percentage.set(parseInt((v / total) * 100)));
</script>

<div class="main-container">
  <div class="popup-container shadow-xl">
    <div class="flex justify-center">nextGPT loading...</div>
    <div class="popup-indicator">
      <RadialProgressIndicator {total} progress={$progress} percentage={$percentage} />
    </div>
    <div class="flex justify-center">&commat;copyright</div>
  </div>
</div>

<style>
  .popup-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div {
    outline: 1px solid var(--border-xheavy);
  }

  .main-container {
    position: fixed;

    height: 100dvh;
    width: 100dvw;

    inset: 0;

    backdrop-filter: blur(4px);
    z-index: 10;
  }

  .popup-container {
    overflow: hidden;
    display: grid;
    grid-template-rows: 3rem 1fr 2rem;
    align-items: stretch;
    justify-items: stretch;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50dvi;
    height: 50dvb;
    background: var(--main-surface-primary);
    border-radius: calc(0.5rem + 4px);
    z-index: 0;
  }
</style>
