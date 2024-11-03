<script>
  import { SearchIcon } from "../../../../icons";

  /**@type {boolean}*/
  export let isExpanded;

  let inputEl = null;
  function useClickAction(node) {
    function clickHandler() {
      if (!isExpanded) return;
      isExpanded = false;
      setTimeout(() => inputEl.focus(), 0);
    }

    node.addEventListener("click", clickHandler);

    return {
      destroy() {
        node.removeEventListener("click", clickHandler);
      },
    };
  }
</script>

<div class:minimized={isExpanded} use:useClickAction>
  <input bind:this={inputEl} class="search-input" placeholder="search" name="search" />
  <button class="search-btn"><SearchIcon /></button>
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
  }

  div.minimized {
    max-width: 2.25rem;
  }

  div.minimized > input {
    display: none;
  }

  div:is(:focus-visible, :focus-within, :focus) {
    outline: 2px solid var(--border-medium);
    outline-offset: -0.5px;
  }

  div:is(:focus-visible, :focus-within, :focus) button {
    background-color: var(--border-xheavy);
    font-weight: 900;
  }

  div:not(.minimized):not(:has(:placeholder-shown)) button {
    background-color: var(--black);
    color: white;
  }

  :global(.dark) div:not(.minimized):not(:has(:placeholder-shown)) button {
    background-color: var(--white);
    color: black;
  }

  :not(.minimized) button {
    outline-color: transparent;
  }

  div:has(:placeholder-shown) button,
  button {
    outline: 1px solid var(--border-medium);
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
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input:is(:focus-visible, :focus-within, :focus) {
    outline: none;
  }
</style>
