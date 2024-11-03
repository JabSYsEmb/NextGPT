<script>
  import { NewFolderIcon } from "../../../../icons";

  /**@type {boolean}*/
  export let isExpanded;

  /**@type {HTMLElement | null}*/
  let inputEl;

  function useExpandAction(/**@type {HTMLElement} */ node) {
    function clickHander() {
      if (isExpanded) return;

      isExpanded = true;

      setTimeout(() => inputEl.focus(), 0);
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
  .main {
    min-width: 2.25rem;

    position: relative;

    overflow: hidden;
    height: 100%;

    display: flex;

    cursor: pointer;
    border-radius: 0.25rem;
    outline: 1px solid var(--border-medium);
    background-color: var(--main-surface-background);

    transition: all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .main:is(:focus-visible, :focus-within, :focus) {
    outline: 2px solid var(--border-heavy);
    outline-offset: -0.5px;
  }

  .main.expanded {
    flex-grow: 1;
    min-width: calc(100% - 2.5rem - 0.375rem);
  }

  .expanded:not(:has(:placeholder-shown)) .main__icon-div {
    background-color: var(--black);
    outline-color: transparent;
    color: var(--white);
    cursor: pointer;
  }

  .dark .expanded:not(:has(:placeholder-shown)) .main__icon-div {
    background-color: var(--white);
    color: var(--black);
  }

  .expanded .main__icon-div {
    background-color: var(--border-xheavy);
  }

  .main__icon-div {
    position: absolute;
    top: 50%;
    right: 0;
    margin-inline: 0.25rem;
    transform: translateY(-50%);

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 25%;
    width: 1.75rem;
    height: 1.75rem;

    background-color: transparent;
    outline: 1px solid var(--border-medium);
    transition: all 150ms ease-in-out;
  }

  :not(.expanded) input {
    display: none;
  }

  input {
    min-width: 0;
    flex-grow: 1;

    overflow: hidden;
    margin-right: 2.5rem;
    direction: ltr;
    padding-inline-start: 0.5rem;
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
</style>
