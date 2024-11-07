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
  <div class="popup-container">
    <RadialProgressIndicator {total} progress={$progress} percentage={$percentage} />
  </div>
</div>

<style>
  * {
    outline: 1px solid red;
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
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45dvw;
    height: 55dvh;
    background: linear-gradient(45deg, var(--main-surface-primary), var(--main-surface-tertiary));
    border-radius: 25px;
    outline: 1px solid var(--border-xheavy);
    z-index: 0;
  }
</style>
