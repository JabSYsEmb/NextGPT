<script>
  import { SearchIcon } from "../../../../icons";

  /**@type {boolean}*/
  export let isExpanded;

  let inputEl = null;
  function useClickAction(node) {
    function clickHandler() {
      if (isExpanded) {
        isExpanded = false;
        setTimeout(() => inputEl.focus(), 500);
      }
    }

    node.addEventListener("click", clickHandler);

    return () => {
      node.removeEventListener("click", clickHandler);
    };
  }
</script>

<div class:minimized={isExpanded} use:useClickAction>
  <input bind:this={inputEl} class="search-input" placeholder="search" name="search" />
  <button class="search-btn"><SearchIcon /></button>
</div>

<style>
  div {
    flex-grow: 1;
    min-width: 0;

    display: grid;
    overflow: hidden;
    position: relative;
    grid-template-rows: 1fr;
    border-radius: 0.375rem;
    grid-template-columns: 1fr;
    outline: 1px solid var(--border-medium);
    background-color: rgb(210 210 210 / var(--tw-bg-opacity));
  }

  :global(.dark) div {
    background-color: var(--main-surface-secondary);
  }

  div.minimized {
    width: 2.5rem;
  }

  div.minimized > input {
    display: none;
  }

  div:is(:focus-visible, :focus-within, :focus) {
    outline: 2px solid var(--text-error);
    outline-offset: -0.5px;
  }

  div:is(:focus-visible, :focus-within, :focus) button {
    background-color: var(--text-error);
    outline: none;
    font-weight: 900;
    color: white;
  }

  button {
    position: absolute;
    overflow: hidden;
    top: 50%;
    transition: all 150ms ease-in-out;
    transform: translateY(-50%);
    outline: 1px solid var(--border-medium);
    height: 1.75rem;
    width: 1.75rem;
    border-radius: 25%;
    display: flex;
    justify-content: center;
    align-items: center;

    margin-inline: 0.25rem;
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
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input:is(:focus-visible, :focus-within, :focus) {
    outline: none;
  }
</style>
