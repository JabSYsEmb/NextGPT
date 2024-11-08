<script>
  import { openDB } from "idb";

  import UtilityElement from "./utilities/utility-element.svelte";
  import ConvoAnchorElement from "./convo-anchor-element.svelte";

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
  {#if filtered.length && filtered.length !== conversations.length}
    {#each filtered as item (item.id)}
      <ConvoAnchorElement {item} />
    {/each}
  {:else if conversations}
    {#each conversations as item (item.id)}
      <ConvoAnchorElement {item} />
    {/each}
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
</style>
