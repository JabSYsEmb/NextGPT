<script>
  import { HorizontalResizeIcon } from "../icons";

  /** @type {HTMLElement} */
  export let node;
  /** @type {(ev: DocumentEventMap['mousemove']) => any}*/
  export let onResizing;
  /** @type {(ev: DocumentEventMap['mouseup']) => any}*/
  export let onResized;
  export let initialWidth;

  let btn;
  let isResizing = false;

  function onMouseDown() {
    isResizing = true;
    node.style.width = initialWidth;
    node.classList.add("resizing");

    document.addEventListener("mousemove", onResizing);
    document.addEventListener("mouseup", onMouseUp, { once: true });
  }

  function onMouseUp() {
    isResizing = false;
    node.classList.remove("resizing");

    onResized();
    document.removeEventListener("mousemove", onResizing);
  }
</script>

<button id="slider" on:mousedown={onMouseDown} bind:this={btn}>
  <HorizontalResizeIcon class="m-auto" />
</button>

<style>
  button {
    position: absolute;
    display: flex;
    justify-content: center;
    align-content: center;
    right: 0;
    top: calc(50%);
    transform: translate(50%, -50%);
    cursor: col-resize;
    width: 1.15rem;
    height: 2.25rem;
    background-color: var(--main-surface-tertiary);
    border-radius: 0.5em;
    z-index: 12;
  }
</style>
