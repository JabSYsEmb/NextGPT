<script>
  import ConversationContainer from "./components/conversation-container.svelte";
  import EmptyCard from "./components/empty-card.svelte";
  import InsertFolderInput from "./folder/insert-folder-input.svelte";
  import SearchInput from "./search/search-input.svelte";

  /**@type {import('../../../../types.d').DBObjectSvelteStore}*/
  export let dbObjectSvelteStore;

  let searchQuery = "";
  function handleSearchInput(event) {
    searchQuery = event.target.value;
  }

  function handleClickOnEmptyCard() {
    document.getElementById("prompt-textarea")?.focus();
  }
</script>

<div class="nextgpt--main__div">
  <div class="nextgpt--utils__div">
    <SearchInput on:input={handleSearchInput} />
    <InsertFolderInput {...$dbObjectSvelteStore} />
  </div>
  {#if $dbObjectSvelteStore.conversations.length + $dbObjectSvelteStore.folders.length === 0}
    <EmptyCard on:click={handleClickOnEmptyCard}>
      <span>No Conversation Yet!</span>
    </EmptyCard>
  {:else if searchQuery !== ""}
    {@const filteredConversations = $dbObjectSvelteStore.items.filter((convo) =>
      convo.title.toLowerCase().includes(searchQuery.toLowerCase())
    )}
    <ConversationContainer conversations={filteredConversations} />
  {:else}
    <ConversationContainer
      folders={$dbObjectSvelteStore.folders}
      conversations={$dbObjectSvelteStore.conversations
        .sort((a, b) => new Date(b.update_time).getTime() - new Date(a.update_time).getTime())
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
    gap: 0.375rem;
  }
</style>
