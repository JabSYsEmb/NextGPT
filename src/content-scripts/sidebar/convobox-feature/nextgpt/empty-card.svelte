<button class="flex justify-center items-center" on:click>
  {#if $$slots}
    <slot />
  {:else}
    <span>Click to action!</span>
  {/if}
</button>

<style>
  button {
    width: 100%;
    position: relative;
    min-width: 0;
    border-radius: 0.25rem;
    overflow: hidden;
    border: 1px solid var(--border-medium);
    background-color: var(--sidebar-surface-primary);

    height: 2.75rem;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--sidebar-surface-secondary);
  }
</style>
