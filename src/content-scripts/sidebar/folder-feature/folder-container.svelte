<script>
  import { openDB } from "idb";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { useSortable } from "./actions";

  import UtilityElement from "./utilities/utility-element.svelte";
  import ConvoAnchorElement from "./convo-anchor-element.svelte";
  import FolderElement from "./folder-element.svelte";

  /**@type {import('svelte/store').Writable<any[]>}*/
  const folders = writable([]);
  setContext("folders", folders);

  /**@type {Array<any> | null}*/
  let conversations = [];

  async function updateList() {
    conversations = await openDB(window.userId).then((db) => {
      const tx = db.transaction("conversations", "readonly");
      return tx
        .objectStore("conversations")
        .getAll()
        .then((conversations) =>
          conversations.sort((a, b) => new Date(b.update_time).getTime() - new Date(a.update_time).getTime())
        );
    });

    const foldersObj = await openDB(window.userId).then((db) => {
      return db.transaction("folders", "readonly").objectStore("folders").getAll();
    });

    folders.set([{ name: "archive", id: Date.now(), items: conversations.filter((item) => item.is_archived) }]);

    conversations = conversations.filter((item) => !item.is_archived);
  }

  let filtered = [];
  function onInputSearchQuery(/**@type {MouseEvent}*/ e) {
    filtered = conversations.filter((item) => item.title.toLowerCase().includes(e.target.value.toLowerCase()));
  }

  // onMount:
  document.addEventListener("preload", updateList);
  window.addEventListener("validate-db", updateList);
</script>

<div id="folder-view">
  <UtilityElement on:input={onInputSearchQuery} />
  <ul use:useSortable>
    {#each $folders as folder (folder.id)}
      <FolderElement {...folder} />
    {/each}

    {#each conversations as item (item.id)}
      <ConvoAnchorElement {item} />
    {/each}
  </ul>
</div>

<style>
  #folder-view {
    display: flex;
    width: 100%;
    min-height: 50dvh;
    flex-direction: column;
    justify-content: flex-start;
    padding-inline: 1px;
  }

  ul {
    display: flex;
    flex-direction: column;

    width: 100%;
  }
</style>
