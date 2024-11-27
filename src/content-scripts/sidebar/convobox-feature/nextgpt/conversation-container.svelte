<script>
  import ConversationCard from "./conversation-card.svelte";
  import ConversationContextmenu from "./conversation-contextmenu.svelte";
  export let conversations = [];

  let context_menu_obj = null;
  function handleMenuClick(/**@type {MouseEvent}*/ e) {
    context_menu_obj = { ...e.detail };
  }

  function handleMenuClose() {
    context_menu_obj = null;
  }
</script>

<ul class="flex flex-col">
  {#each conversations as conversation (conversation.id)}
    <ConversationCard
      item={conversation}
      on:menucontext={handleMenuClick}
      dropdownOpen={conversation.id === context_menu_obj?.convoId}
    />
  {/each}
</ul>

{#if context_menu_obj}
  <ConversationContextmenu {...context_menu_obj} on:close={handleMenuClose} />
{/if}

<style>
  ul {
    margin-block: 0.125rem;
    gap: 0.25rem;
  }
</style>
