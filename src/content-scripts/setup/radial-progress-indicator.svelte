<script>
  /**@type {number}*/
  export let percentage;
  /**@type {number}*/
  export let total;
  /**@type {number}*/
  export let progress;
</script>

<div class="indicator--outer_div shadow-ml" style="--percentage: {percentage + 0.5}%;">
  <div class="indicator--inner_div">
    <span class="indicator--count_span">{String(progress).padStart(String(total).length, "0")}</span>
    <span class="indicator--total_span">/{total}</span>
  </div>
</div>

<style>
  .indicator--count_span {
    font-size: 5vh;
    font-weight: bold;
    color: var(--progress-color);
  }

  .indicator--total_span {
    padding-block-start: 3.5vh;
    font-size: 2.5vh;
    color: hsl(from var(--progress-color) h s l / 0.3);
  }

  div {
    font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .indicator--outer_div {
    width: auto;
    height: 60%;
    background-color: red;

    aspect-ratio: 1/1;
    background: conic-gradient(
      var(--progress-color) var(--percentage),
      var(--text-quaternary) calc(var(--percentage) - 90%)
    );
  }

  .indicator--inner_div {
    width: 90%;
    height: auto;
    display: flex;
    gap: 2px;
    aspect-ratio: 1/1;
    background-color: var(--main-surface-primary);
  }
</style>
