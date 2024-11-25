<script>
  import ConversationCard from "./conversation-card.svelte";
  import ConversationContextmenu from "./conversation-contextmenu.svelte";
  export let conversations = [];

  let x, y, convoId, is_archived;
  function handleMenuClick(/**@type {MouseEvent}*/ e) {
    x = e.detail.x;
    y = e.detail.y;
    convoId = e.detail.convoId;
    is_archived = e.detail.is_archived;
  }
</script>

<ul class="flex flex-col">
  {#each conversations as conversation (conversation.id)}
    <ConversationCard item={conversation} on:menucontext={handleMenuClick} />
  {/each}
</ul>

{#if x && y}
  <ConversationContextmenu {x} {y} {convoId} {is_archived} />
{/if}

<style>
  ul {
    margin-block: 0.125rem;
    gap: 0.25rem;
  }
</style>
