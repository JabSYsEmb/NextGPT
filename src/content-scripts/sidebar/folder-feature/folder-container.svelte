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
  let conversations = null;

  async function updateList() {
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

    await openDB(window.userId).then((db) => {
      db.transaction("folders", "readonly").objectStore("folders").getAll().then(folders.set);
    });
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
  </ul>

  {#if filtered.length && filtered.length !== conversations.length}
    <ul use:useSortable>
      {#each filtered as item (item.id)}
        <ConvoAnchorElement {item} />
      {/each}
    </ul>
  {:else if conversations}
    <ul use:useSortable>
      {#each conversations as item (item.id)}
        <ConvoAnchorElement {item} />
      {/each}
    </ul>
  {/if}
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
