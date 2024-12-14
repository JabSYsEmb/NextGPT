<script>
  import { NewFolderIcon } from "../../../../icons";
  import { Button, Dialog } from "../../../components";

  export let conversations = [];

  /**@type {HTMLDialogElement | undefined}*/
  let dialog;

  console.log($$props);
</script>

<Button
  borderRadius="0.375rem"
  outlineWidth="1px"
  width="fit-content"
  height="100%"
  on:click={() => dialog?.showModal()}
>
  <NewFolderIcon />
</Button>

<Dialog width="45vi" height="30vi" bind:dialog>
  <span slot="header">hello new folder component</span>

  <div slot="content" class="overflow-y-auto">
    {#if conversations.length}
      <ul>
        {#each conversations as conversation}
          <li>{conversation.title}</li>
        {/each}
      </ul>
    {:else}
      <em>No conversations yet!</em>
    {/if}
  </div>

  <svelte:fragment slot="footer">
    <Button height="100%" on:click={dialog.close.bind(dialog)}>close</Button>
  </svelte:fragment>
</Dialog>

<style>
  div[slot="content"] {
    overflow-y: auto;
  }
</style>
