<script>
  import { SearchIcon } from "../../../../../icons";

  /**@type {HTMLInputElement | null}*/
  let inputEl = null;

  function clickHandler() {
    requestIdleCallback(() => inputEl.focus());
  }
</script>

<div>
  <input bind:this={inputEl} class="search-input" placeholder="search (by title)" tabindex="-1" on:input />
  <button class="search-btn" on:click={clickHandler} tabindex="-1"><SearchIcon /></button>
</div>

<style>
  div {
    width: 100%;

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

  div:not(:has(:placeholder-shown)) button {
    background-color: light-dark(var(--black), var(--white));
    color: light-dark(var(--white), var(--black));
  }

  button {
    position: absolute;
    overflow: hidden;
    top: 50%;
    transform: translateY(-50%);
    height: 1.75rem;
    width: 1.75rem;
    border-radius: 25%;
    display: flex;
    justify-content: center;
    align-items: center;

    margin-inline: 0.25rem;

    /***/
    background-color: var(--border-xheavy);
    font-weight: 900;

    transition: all 150ms ease-in-out;
  }

  input {
    flex-grow: 1;
    height: 100%;
    padding-inline-start: 2.5rem;
    padding-inline-end: 0.5rem;
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
