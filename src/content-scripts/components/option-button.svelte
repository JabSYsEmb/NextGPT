<script>
  export let label = undefined;
  export let Icon = undefined;
  let className;
  export { className as class };

  let baseClass =
    "flex items-center relative m-1.5 p-2.5 text-sm cursor-pointer focus-visible:outline-0 hover:bg-[#f5f5f5] focus-visible:bg-[#f5f5f5] dark:hover:bg-token-main-surface-secondary dark:focus-visible:bg-token-main-surface-secondary rounded-md my-0 px-3 mx-2 dark:radix-state-open:bg-token-main-surface-secondary gap-2.5 py-3 !pr-3";
</script>

<button class="{baseClass} {className}" on:click {...$$restProps}>
  <div class="option__outer-div">
    <div class="option__inner-div" class:icon-only={!label}>
      {#if Icon}
        <svelte:component this={Icon} />
      {/if}
      {#if label}
        <span>{label}</span>
      {/if}
      <slot />
    </div>
  </div>
</button>

<style>
  span {
    min-width: max-content;
  }

  .option__inner-div {
    display: grid;
    grid-template-columns: 1fr 5fr;
    justify-items: flex-start;
    align-items: center;
  }

  .option__inner-div.icon-only {
    width: 100%;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }

  .option__outer-div {
    display: flex;
    align-items: center;
  }

  .option__outer-div {
    flex-grow: 1;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .option__inner-div {
    gap: 0.75rem;
  }

  button:disabled {
    opacity: 0.75;
    cursor: progress;
    pointer-events: all;
  }

  .disabled {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background-color: var(--main-surface-tertiary) !important;
    cursor: not-allowed !important;
    pointer-events: none !important;
  }
</style>
