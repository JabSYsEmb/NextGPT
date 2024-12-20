<script>
  import { NewFolderIcon, AddItemsIcon, DirectoryIcon } from "../../../../../icons";
  import { Button, Dialog } from "../../../../components";
  import { languageObj } from "../../../../../utils";
  import { FolderConvoSelection, FolderCreation, FolderSubmit } from "./index";

  export let conversations = [];
  export let folders = [];

  Object.assign(folders, [
    {
      title: "cs-related",
    },
    {
      title: "medical",
    },
  ]);

  const dialogBtnStyle = {
    width: "12ch",
    height: "100%",
    borderRadius: "10px",
  };

  /**@type {['creation' , 'selection' , 'submit']}*/
  const pages = ["creation", "selection", "submit"];
  let page = pages[0];

  /**
   *
   * @param {HTMLLIElement} node
   */
  function usePageSelection(node, new_page) {
    function handleClick() {
      if (node.getAttribute("disabled") === "true") return;
      page = new_page ?? node.textContent.toLowerCase();
    }

    node.addEventListener("click", handleClick);

    return {
      destroy() {
        node.removeEventListener("click", handleClick);
      },
    };
  }

  function handleDiscardClick() {
    page = pages[0];
    const { title } = nfolder;
    nfolder = title ? { title } : {};
    dialog.close();
  }

  function handleProceedClick() {
    let nextPage = pages[pages.indexOf(page) + 1];
    document.getElementById(`${nextPage}-id`).click();
  }

  function handleSaveClick() {
    nfolder = {};
    handleDiscardClick();
  }

  /**@typedef {Object} FolderObject
   * @property {string} title
   * @property {string[]} items
   */

  /**@type {HTMLDialogElement | undefined}*/
  let dialog;

  /**@type {FolderObject}*/
  let nfolder = {};
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
        <li id={"creation-tab"} class:active={page === "creation"} use:usePageSelection={"creation"}>
          <NewFolderIcon />
          creation
        </li>
        <li
          id={"selection-id"}
          class:active={page === "selection"}
          disabled={!nfolder?.title}
          use:usePageSelection={"selection"}
        >
          <AddItemsIcon />
          selection
        </li>
        <li
          id={"submit-id"}
          class:active={page === "submit"}
          disabled={!nfolder?.title}
          use:usePageSelection={"submit"}
        >
          <DirectoryIcon />
          submit
        </li>
      </ul>
    </aside>

    <div class="flex flex-col gap-2 h-full">
      {#if page === "creation"}
        <FolderCreation {dialogBtnStyle} {folders} bind:nfolder />
      {:else if page === "selection"}
        <FolderConvoSelection bind:conversations bind:nfolder />
      {:else}
        <FolderSubmit {nfolder} bind:conversations />
      {/if}
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button {...dialogBtnStyle} class="error" on:click={handleDiscardClick}>
      <span>
        {languageObj.discard ?? "abort"}
      </span>
    </Button>

    <Button {...dialogBtnStyle} on:click={page === pages.at(-1) ? handleSaveClick : handleProceedClick}>
      {#if page === pages.at(-1)}
        <span> save </span>
      {:else}
        <span> next </span>
      {/if}
    </Button>
  </svelte:fragment>
</Dialog>

<style>
  ul {
    display: flex;
    flex-direction: column;
    padding-inline-end: 0.5rem;
    gap: 0.5rem;
  }
  ul > li {
    height: 3rem;
    /* outline: 1px solid red; */
    padding-inline: 0.5rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;

    text-transform: uppercase;

    background: var(--border-light);
    color: var(--sidebar-icon);
  }

  li.active {
    font-weight: 800;
    background: var(--sidebar-surface-secondary);
  }

  li[disabled="false"],
  li.active,
  ul > li:first-of-type {
    color: white;
  }

  .main {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 1fr;
    width: 100%;
  }
</style>
