<script>
  import UtilityElement from "./utilities/utility-element.svelte";
  import { shallowTo } from "../../utils";
  import { TextFileIcon, DragIcon, ArchiveFileIcon } from "../../../icons";
  import { url } from "../../../stores";
  import { openDB } from "idb";

  /**@type {Array<any> | null}*/
  let conversations = null;

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

  // onMount:
  document.addEventListener("preload", async () => {
    conversations = await openDB(window.userId).then((db) => {
      const tx = db.transaction("conversations", "readonly");
      return tx
        .objectStore("conversations")
        .getAll()
        .then((conversations) =>
          conversations
            .sort((a, b) => new Date(b.update_time).getTime() - new Date(a.update_time).getTime())
            .sort((a, b) => !b.is_archived - !a.is_archived)
        );
    });
  });

  let filtered = [];
  function onEventChange(/**@type {MouseEvent}*/ e) {
    filtered = conversations.filter((item) => item.title.toLowerCase().includes(e.target.value.toLowerCase()));
  }
</script>

<div id="folder-view">
  <UtilityElement on:input={onEventChange} />
  {#if conversations?.length}
    {#if filtered.length !== conversations.length && filtered.length > 0}
      {#each filtered as item (item.id)}
        <a class:active={$url === item.id} href="/c/{item.id}" use:useAnchor={item} tabindex="0">
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
      {/each}
    {:else if conversations}
      {#each conversations as item (item.id)}
        <a class:active={$url === item.id} href="/c/{item.id}" use:useAnchor={item} tabindex="0">
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
      {/each}
    {/if}
  {/if}
</div>

<style>
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

  span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .holder {
    background-color: var(--main-surface-tertiary);

    outline: 1px solid var(--border-medium);
    cursor: move;
  }

  #folder-view {
    display: flex;
    width: 100%;
    min-height: 50dvh;
    flex-direction: column;
    justify-content: flex-start;
    padding-inline: 1px;
  }

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

  a:hover,
  a.active {
    background-color: var(--sidebar-surface-secondary);
  }
</style>
