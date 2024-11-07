<script>
  import { cubicIn } from "svelte/easing";
  import { tweened } from "svelte/motion";

  export let percentage = 0;

  const val = tweened(percentage, {
    duration: 400,
    easing: cubicIn,
  });

  setInterval(() => {
    const random = Math.random() * 20;
    val.update((n) => n + random);
    percentage += random;
    percentage = parseFloat(percentage.toFixed(2));
    if (percentage > 100) {
      val.set(0);
      percentage = 0;
    }
  }, 1000);
</script>

<div class="indicator--outer_div" style="--percentage: {$val}%;">
  <div class="indicator--inner_div">{percentage.toFixed(2)}%</div>
</div>

<style>
  div {
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .indicator--outer_div {
    width: 100px;
    height: 100px;
    background: conic-gradient(orange var(--percentage), gray var(--percentage) 100%);
  }

  .indicator--inner_div {
    width: 85%;
    height: 85%;
    background-color: var(--main-surface-secondary);
  }
</style>
