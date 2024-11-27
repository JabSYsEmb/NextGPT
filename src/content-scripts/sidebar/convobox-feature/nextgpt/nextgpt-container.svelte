<script>
  import ConversationContainer from "./conversation-container.svelte";
  import SearchInput from "./search-input.svelte";

  /**@typedef {Object} DBObjectSvelteStore
   * @property {import('../../../../types.d').DataItemType[]} conversations
   */

  /**@type {import('svelte/store').Readable<DBObjectSvelteStore>}*/
  export let dbObjectSvelteStore;

  let searchQuery = "";
  function handleSearchInput(event) {
    searchQuery = event.target.value;
  }
</script>

<div class="nextgpt--main__div">
  <div class="nextgpt--utils__div">
    <SearchInput on:input={handleSearchInput} />
  </div>
  {#if ($dbObjectSvelteStore.conversations ?? []).length === 0}
    <p>No conversations yet</p>
  {:else if searchQuery !== ""}
    {@const filteredConversations = $dbObjectSvelteStore.conversations.filter((convo) =>
      convo.title.toLowerCase().includes(searchQuery.toLowerCase())
    )}
    <ConversationContainer conversations={filteredConversations} />
  {:else}
    <ConversationContainer
      conversations={$dbObjectSvelteStore.conversations
        .sort((a, b) => new Date(b.update_time).getDate() - new Date(a.update_time).getDate())
        .sort((a, b) => a.is_archived - b.is_archived)}
    />
  {/if}
</div>

<style>
  .nextgpt--main__div {
    min-height: 30dvh;
  }

  .nextgpt--utils__div {
    display: flex;
    justify-content: space-between;
    margin-block-end: 0.75rem;
    height: 2.5rem;
    width: 100%;
  }
</style>
