<script>
  import { TextFileIcon, DragIcon, ArchiveFileIcon } from "../../../icons";
  import { shallowTo } from "../../utils";
  import { draggable } from "./actions";
  import { url } from "../../../stores";

  /**@type {import('../../../types.d').DataItemType}*/
  export let item;

  function useAnchor(node, item) {
    async function onArchive({ success }) {
      if (success) window.location.pathname = `/c/${item.id}`;
    }

    function clickHandler(e) {
      e.preventDefault();
      e.stopPropagation();

      shallowTo(node.href);
    }

    function contextMenuHandler(e) {
      e.preventDefault();
      e.stopPropagation();

      fetch(`/backend-api/conversation/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_archived: !item.is_archived }),
      })
        .then((res) => res.json())
        .then(onArchive);
    }

    node.addEventListener("click", clickHandler);
    node.addEventListener("contextmenu", contextMenuHandler);

    return {
      destroy() {
        node.removeEventListener("click", clickHandler);
        node.removeEventListener("contextmenu", contextMenuHandler);
      },
    };
  }
</script>

<a
  id={item.id}
  class:active={$url === item.id}
  href="/c/{item.id}"
  tabindex="0"
  use:useAnchor={item}
  use:draggable={item.id}
>
  <span class="holder">
    <DragIcon style="margin-inline: 1px; scale: 1.5;" />
  </span>
  <span class="icon">
    <svelte:component this={item.is_archived ? ArchiveFileIcon : TextFileIcon} />
  </span>
  <span class="title">
    {item.title || item.id}
    <span class="convo-footer">{new Date(item.create_time).toLocaleDateString()}</span>
  </span>
</a>

<style>
  a {
    position: relative;
    display: grid;
    grid-template-columns: 12px 30px 1fr;
    margin-block: 0.15rem;
    align-items: stretch;
    overflow: hidden;
    min-width: 0;

    height: 2.5rem;
    cursor: pointer;
    border-radius: 0.125rem;

    text-overflow: ellipsis;
    transition: all 200ms ease-in-out;
    outline: 1px solid var(--border-medium);
  }

  a:hover,
  a.active {
    background-color: var(--sidebar-surface-secondary);
  }

  a.active {
    outline: 2px solid hsla(234, 44%, 45%);
  }

  a:is(:focus, :focus-visible, :focus-within) {
    outline: 2px solid hsla(234, 44%, 45%);
    outline-offset: -0.5px;
    background-color: hsla(234, 44%, 45%, 0.266);
  }

  a.active:is(:focus, :focus-visible, :focus-within) {
    outline: 2px solid var(--text-error);
    outline-offset: -0.5px;
    background-color: hsla(0, 44%, 45%, 0.266);
  }

  .holder {
    background-color: var(--main-surface-tertiary);

    outline: 1px solid var(--border-medium);
    cursor: move;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span.title {
    position: relative;
    justify-content: flex-start;
    padding-inline-start: 0.25rem;
  }

  span.convo-footer {
    position: absolute;
    inset-inline-end: 6px;
    inset-block-end: 2px;
    font-size: x-small;
    font-weight: 800;
    font-family: monospace;
    color: var(--text-tertiary);
    line-height: 2ch;
  }

  :global(.drag-over) {
    outline: 2px dashed orangered !important;
  }
</style>
