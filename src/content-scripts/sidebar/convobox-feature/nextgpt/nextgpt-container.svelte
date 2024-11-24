<script>
  import ConversationContainer from "./conversation-container.svelte";

  /**@typedef {Object} DBObjectSvelteStore
   * @property {import('../../../../types.d').DataItemType[]} conversations
   */

  /**@type {import('svelte/store').Readable<DBObjectSvelteStore>}*/
  export let dbObjectSvelteStore;
</script>

<div>
  {#if ($dbObjectSvelteStore.conversations ?? []).length === 0}
    <p>No conversations yet</p>
  {:else}
    <ConversationContainer conversations={$dbObjectSvelteStore.conversations} />
  {/if}
</div>

<style>
  div {
    min-height: 30dvh;
  }
</style>
