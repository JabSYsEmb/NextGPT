<script>
  import { ChatgptConvoIcon, ChatgptArchiveConvoIcon } from "../../icons";

  export let title;
  export let is_archived;
</script>

<div>
  {#if is_archived}
    <ChatgptArchiveConvoIcon />
  {:else}
    <ChatgptConvoIcon />
  {/if}

  <span>{title}</span>
</div>

<style>
  div {
    grid-area: 1 / 1 / 2 / 2;
    position: relative;
    min-width: 0;
    overflow: hidden;

    display: flex;

    align-items: center;
    gap: 0.5rem;
    padding-inline: 0.25rem;

    height: 2.75rem;
    width: 100%;
  }
</style>
