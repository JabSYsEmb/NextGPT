<script>
  /**@type {number}*/
  export let percentage = 0;
  /**@type {number}*/
  export let total = 999;
  /**@type {number}*/
  export let progress = 0;
</script>

<div class="indicator--outer_div" style="--percentage: {percentage + 0.5}%;">
  <div class="indicator--inner_div">
    <span>{progress}/{total}</span>
  </div>
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
    background: conic-gradient(orange var(--percentage), gray calc(var(--percentage) - 100%));
  }

  .indicator--inner_div {
    width: 85%;
    height: 85%;
    background-color: var(--main-surface-secondary);
  }
</style>
