<script>
  import { SearchIcon, TextFileIcon, DragIcon, FolderIcon } from "../../../icons";
  import { url } from "../../../stores";
  import { openDB } from "idb";

  /**@type {Array<any> | null}*/
  let conversations = null;

  /**
   *
   * @param {string} url
   */
  function useShallowRouting(url) {
    window.history.replaceState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
    document.dispatchEvent(new CustomEvent("onURLChange", { detail: { url } }));
  }

  function useAnchor(node, item) {
    async function onArchive({ success }) {
      if (success) window.location.pathname = `/c/${item.id}`;
    }

    function clickHandler(e) {
      e.preventDefault();
      e.stopPropagation();

      useShallowRouting(node.href);
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

    return () => {
      node.removeEventListener("click", clickHandler);
      node.removeEventListener("contextmenu", contextMenuHandler);
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
</script>

<div id="folder-view">
  {#if conversations}
    <div class="search-div">
      <div class="flex relative flex-1 flex-grow">
        <input class="search-input" placeholder="search" name="search" />
        <button class="search-btn-right"><SearchIcon /></button>
      </div>
      <button class="search-btn"><FolderIcon /></button>
    </div>

    {#each conversations as item (item.id)}
      <a class:active={$url === item.id} class:archive={item.is_archived} href="/c/{item.id}" use:useAnchor={item}>
        <span class="holder">
          <DragIcon style="margin-inline: 1px; scale: 1.5;" />
        </span>
        <span class="icon">
          <TextFileIcon />
        </span>
        <span class="title">
          {item.title}
          <span class="convo-footer">{new Date(item.create_time).toLocaleDateString()}</span>
        </span>
      </a>
    {/each}
  {:else}
    <span>something went wrong</span>
  {/if}
</div>

<style>
  .search-btn-right {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    outline: 1px solid var(--border-medium);
    height: 85%;
    width: auto;
    aspect-ratio: 1/1;
    border-radius: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .holder {
    background-color: var(--main-surface-tertiary);
    outline: 1px solid var(--border-medium);
  }

  #folder-view {
    display: flex;
    width: 100%;
    min-height: 50dvh;
    flex-direction: column;
    justify-content: flex-start;
    padding-inline: 1px;
  }

  .search-div {
    display: flex;
    justify-content: stretch;
    gap: 0.375rem;
    padding-block: 0.25rem;
    height: 2.75rem;
    margin-block-end: 0.25rem;
  }

  .search-input {
    min-width: 0;
    flex-grow: 1;
    height: 100%;
    padding-inline: 0.5rem;
    border-radius: 0.375rem;
    outline: 1px solid var(--border-medium);
    background-color: rgb(210 210 210 / var(--tw-bg-opacity));
  }

  :global(.dark) .search-input {
    background-color: var(--main-surface-secondary);
  }

  .search-btn {
    height: 100%;
    width: 2rem;
    outline: 1px solid var(--border-medium);
    border-radius: 0.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  a {
    position: relative;
    display: grid;
    grid-template-columns: 15px 30px 1fr;
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

  .archive {
    background-color: hsla(10, 80%, 70%, 0.5);
  }

  a:hover,
  a.active {
    background-color: var(--sidebar-surface-secondary);
  }
</style>
