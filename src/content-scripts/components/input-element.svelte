<script>
  /**@type {HTMLInputElement | null}*/
  export let inputEl = null;

  let className;
  export { className as class };
  export let placeholder = "Enter Text";
  export let value;
</script>

<div class={className}>
  <input
    bind:this={inputEl}
    class="search-input"
    {placeholder}
    tabindex="-1"
    bind:value
    on:input
    on:change
    on:focus
    {...$$restProps}
  />
</div>

<style>
  div {
    min-height: 45px;

    display: grid;
    overflow: hidden;
    position: relative;
    grid-template-rows: 1fr;
    border-radius: 0.375rem;
    grid-template-columns: 1fr;
    outline: 1px solid var(--border-medium);
    background-color: var(--main-surface-background);
    margin-inline-start: 2px;
  }

  div:is(:focus-visible, :focus-within, :focus) {
    outline-width: 2px;
  }

  input {
    flex-grow: 1;
    height: 100%;
    padding-inline-start: 0.25rem;
    padding-inline-end: 0.25rem;
    background-color: transparent;
    min-width: 0;
    grid-column: 1 / 2;
  }

  input::placeholder {
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input:is(:focus-visible, :focus-within, :focus) {
    outline: none;
  }
</style>
