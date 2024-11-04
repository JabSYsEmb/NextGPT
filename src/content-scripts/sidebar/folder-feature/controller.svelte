<script>
  import { usePreloadOnPointerDown } from "./action";
  import { createEventDispatcher } from "svelte";

  /**@type {HTMLElement}*/
  export let convo_view_element;
  /**@type {HTMLElement}*/
  export let folder_view_element;

  let isConvoActive = true;

  function switchView(isTargetConvo) {
    if (isConvoActive === isTargetConvo) return;

    if (isConvoActive) {
      folder_view_element.classList.remove("hidden");
      convo_view_element.classList.add("hidden");
      isConvoActive = false;
      return;
    }
    convo_view_element.classList.remove("hidden");
    folder_view_element.classList.add("hidden");
    isConvoActive = true;
  }

  async function preloadHandler() {
    document.dispatchEvent(new CustomEvent("preload"));
  }

  const dispatch = createEventDispatcher();
</script>

<div class:left={isConvoActive}>
  <button class:active={isConvoActive} on:click={switchView.bind(null, true)}> chatGPT </button>
  <button
    id="folder-btn"
    class:active={!isConvoActive}
    on:click={switchView.bind(null, false)}
    on:click={() => dispatch("focusSearchInput")}
    use:usePreloadOnPointerDown={{ fn: preloadHandler }}
  >
    Folders
  </button>
</div>

<style>
  div {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    gap: 2px;
    padding: 4px;
    border-radius: 0.25rem;
    height: 2.25rem;
    padding: 0.5rem;
    margin-block: 0.5rem;
    margin-inline: 1px;
    background-color: var(--border-light);
    outline: 1px solid var(--border-xheavy);
  }

  div::before {
    content: " ";
    position: absolute;
    width: calc(50% - 0.25rem);
    top: 50%;
    height: 75%;
    transform: translateY(-50%);
    transition: left 100ms ease-in-out;
    border-radius: 0.25rem;
    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.1);
    outline: 1px solid var(--text-quaternary);
    background-color: var(--main-surface-primary);
    z-index: 0;
  }

  div.left::before {
    left: 0.25rem;
  }

  div::before {
    left: 50%;
  }

  button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    color: var(--text-secondary);
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  button.active {
    color: var(--text-primary);
  }
</style>
