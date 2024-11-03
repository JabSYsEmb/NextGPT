<script>
  import { NewFolderIcon } from "../../../../icons";

  /**@type {boolean}*/
  export let isExpanded;

  /**@type {HTMLElement | null}*/
  let inputEl;

  function useExpandAction(/**@type {HTMLElement} */ node) {
    function clickHander() {
      isExpanded = !isExpanded;

      if (isExpanded) setTimeout(() => inputEl.focus(), 0);
    }

    node.addEventListener("click", clickHander);

    return {
      destory() {
        node.removeEventListener("click", clickHander);
      },
    };
  }
</script>

<div class="main" class:expanded={isExpanded} use:useExpandAction>
  <div class="main__icon-div">
    <NewFolderIcon />
  </div>
  <input bind:this={inputEl} placeholder="new folder" name="folder-name" />
</div>

<style>
  input {
    flex-grow: 1;
    min-width: 0;
    height: 100%;
    padding-inline-start: 0.5rem;
    padding-inline-end: 2.5rem;
    background-color: transparent;
  }

  input:is(:focus-visible, :focus-within, :focus) {
    outline: none;
  }
  input::placeholder {
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;
  }

  .main:is(:focus-visible, :focus-within, :focus) {
    outline: 2px solid var(--hint-text);
    outline-offset: -0.5px;
  }

  .main:is(:focus-visible, :focus-within, :focus) .main__icon-div {
    background-color: var(--hint-text);
    outline: none;
    font-weight: 900;
    color: white;
  }

  :not(.expanded) input {
    display: none;
  }

  .main__icon-div {
    margin-inline: 0.25rem;
    width: 2rem;
    display: flex;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    justify-content: center;
    align-items: center;
    outline: 1px solid var(--border-medium);
    border-radius: 25%;
    height: 1.75rem;
    width: 1.75rem;
  }

  .main {
    height: 100%;
    width: 45px;
    position: relative;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-items: center;

    cursor: pointer;
    border-radius: 0.25rem;
    outline: 1px solid var(--border-medium);
    transition: all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    background-color: rgb(210 210 210 / var(--tw-bg-opacity));
  }

  :global(.dark) .main {
    background-color: var(--main-surface-secondary);
  }

  .main:not(.expanded):hover {
    width: 3.5rem;
  }

  .expanded {
    width: 100%;
    background-color: var(--main-surface-secondary);
  }
</style>
