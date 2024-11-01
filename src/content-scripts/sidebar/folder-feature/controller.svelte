<script>
  import { usePreloadOnPointerDown } from "./action";

  /**@type {HTMLElement}*/
  export let convo_view_element;
  /**@type {HTMLElement}*/
  export let folder_view_element;

  let isConvoActive = true;
  function displayConvoView() {
    if (isConvoActive) return;

    convo_view_element.classList.remove("hidden");
    folder_view_element.classList.add("hidden");
    isConvoActive = true;
  }

  function displayFolderView() {
    if (!isConvoActive) return;

    folder_view_element.classList.remove("hidden");
    convo_view_element.classList.add("hidden");
    isConvoActive = false;
  }

  async function preloadHandler() {
    document.dispatchEvent(new CustomEvent("preload"));
  }
</script>

<div>
  <button class:active={isConvoActive} on:click={displayConvoView}>convo</button>
  <button
    class:active={!isConvoActive}
    on:click={displayFolderView}
    use:usePreloadOnPointerDown={{ fn: preloadHandler }}>folders</button
  >
</div>

<style>
  div {
    display: flex;
    outline: 1px solid red;
    width: 100%;
    gap: 2px;
    padding: 4px;
    border-radius: 6px;
    height: 2rem;
    margin-block: 0.5rem;
    margin-inline: 1px;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: blueviolet;
    flex-grow: 1;
  }

  button.active {
    background-color: chocolate;
    color: white;
    font-family: monospace;
  }
</style>
