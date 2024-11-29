<script>
  import ConversationCard from "./conversation-card.svelte";
  import ConversationContextmenu from "./conversation-contextmenu.svelte";
  export let conversations = [];

  let x, y, item;
  function handleMenuClick(/**@type {MouseEvent}*/ e) {
    item = e.detail.item;
    x = e.detail.x ?? 0;
    y = e.detail.y ?? 0;
  }

  function handleMenuClose() {
    x = y = item = undefined;
  }
</script>

<ul class="flex flex-col">
  {#each conversations as conversation (conversation.id)}
    <ConversationCard
      item={conversation}
      on:menucontext={handleMenuClick}
      dropdownOpen={conversation.id === item?.id}
    />
  {/each}
</ul>

{#if item}
  <ConversationContextmenu {item} {x} {y} on:close={handleMenuClose} />
{/if}

<style>
  ul {
    margin-block: 0.125rem;
    gap: 0.25rem;
  }
</style>
