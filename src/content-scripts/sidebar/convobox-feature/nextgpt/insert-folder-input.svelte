<script>
  import { NewFolderIcon } from "../../../../icons";
  import { Button, Dialog, Input } from "../../../components";
  import { languageObj } from "../../../../utils";

  export let conversations = [];

  /**@type {HTMLDialogElement | undefined}*/
  let dialog;

  const dialogBtnStyle = {
    width: "12ch",
    height: "100%",
    borderWidth: "1px",
    borderRadius: "10px",
  };
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

<Dialog width="720px" height="620px" bind:dialog>
  <span slot="header" class="text-lg font-bold">Create New Folder</span>

  <div slot="content" class="main">
    <aside>
      <ul>
        <li>item 1</li>
        <li>item 2</li>
      </ul>
    </aside>

    <div class="flex flex-col gap-2 h-full">
      <Input name="folder-name" type="text" placeholder="Folder Name" />
      <div class="inner">
        <ul {...{ class: conversations.length > 1000 ? "tons-of-items" : "" }}>
          {#each conversations as convo}
            <li>{convo.title}</li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button {...dialogBtnStyle}>
      <span>
        {languageObj.save ?? "save"}
      </span>
    </Button>

    <Button {...dialogBtnStyle} class="error" on:click={dialog.close.bind(dialog)}>
      <span>
        {languageObj.discard ?? "abort"}
      </span>
    </Button>
  </svelte:fragment>
</Dialog>

<style>
  .inner {
    height: 100%;
    position: relative;
    border-radius: 6px;

    background: var(--main-surface-background);
  }

  .inner > ul {
    position: absolute;
    inset: 0;
    overflow-y: scroll;
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
  }

  ul > li {
    height: 2rem;
    padding: 0.25rem;
    border-radius: 6px;
  }

  ul.tons-of-items > li {
    content-visibility: auto;
    contain-intrinsic-block-size: 1.5rem;
  }

  .main {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 1fr;
    width: 100%;
  }
</style>
