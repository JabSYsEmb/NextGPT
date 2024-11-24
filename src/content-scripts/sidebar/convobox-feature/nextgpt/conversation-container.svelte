<script>
  import ConversationCard from "./conversation-card.svelte";
  export let conversations = [];
</script>

<ul class="flex flex-col">
  {#each conversations as conversation (conversation.id)}
    <ConversationCard item={conversation} />
  {/each}
</ul>

<style>
  ul {
    margin-block: 0.125rem;
  }
</style>
