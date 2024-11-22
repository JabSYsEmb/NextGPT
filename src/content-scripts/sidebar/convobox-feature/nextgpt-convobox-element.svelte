<script>
  /**@type {import('../../../types.d').DataItemType[]}*/
  export let conversations = [];
</script>

<div>
  {#if conversations.length === 0}
    <p>No conversations yet</p>
  {:else}
    <ul>
      {#each conversations as conversation (conversation.id)}
        <li>
          <span>{conversation.title}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  div {
    min-height: 30dvh;
  }
</style>
