<script>
  import ConverstationItem from "./conversation-item.svelte";

  /**@type {import('../../../types.d').DataItemType[]}*/
  export let conversations = [];
</script>

<div>
  {#if conversations.length === 0}
    <p>No conversations yet</p>
  {:else}
    <ul class="flex flex-col">
      {#each conversations as conversation (conversation.id)}
        <ConverstationItem item={conversation} />
      {/each}
    </ul>
  {/if}
</div>

<style>
  ul {
    margin-block: 0.125rem;
  }

  div {
    min-height: 30dvh;
  }
</style>
