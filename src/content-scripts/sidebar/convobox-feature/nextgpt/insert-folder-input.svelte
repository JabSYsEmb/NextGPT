<script>
  import { NewFolderIcon } from "../../../../icons";
  import { Button, Dialog, Input, ConversationListItem } from "../../../components";
  import { languageObj } from "../../../../utils";
  import FolderCard from "./folder-card.svelte";

  export let conversations = [];
  export let folders = [];

  Object.assign(folders, [
    {
      name: "cs-related",
    },
    {
      name: "medical",
    },
  ]);

  /**@type {HTMLDialogElement | undefined}*/
  let dialog;

  const dialogBtnStyle = {
    width: "12ch",
    height: "100%",
    borderWidth: "1px",
    borderRadius: "10px",
  };

  /**@type {['creation' , 'selection' , 'submit']}*/
  const pages = ["creation", "selection", "submit"];
  let page = pages[0];

  /**@type {HTMLInputElement} */
  let inputEl;

  /**
   *
   * @param {HTMLLIElement} node
   */
  function usePageSelection(node, new_page) {
    function handleClick() {
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
    dialog.close();
  }

  function handleProceedClick() {
    if (page === pages.at(-1)) {
      console.log("a new folder has been created successfully", page, Date.now());
      page = pages[0];
    } else {
      page = pages[pages.indexOf(page) + 1];
    }
  }

  let new_folder;
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
        <li class:active={page === "creation"} use:usePageSelection={"creation"}>creation</li>
        <li class:active={page === "selection"} use:usePageSelection={"selection"}>selection</li>
        <li class:active={page === "submit"} use:usePageSelection={"submit"}>submit</li>
      </ul>
    </aside>

    <div class="flex flex-col gap-2 h-full">
      <form
        class="flex gap-2"
        on:submit={(e) => {
          e.preventDefault();
          if (!new_folder || new_folder === "") return;

          folders.push({ name: new_folder });
          folders = folders;
        }}
      >
        <Input class="grow" type="text" placeholder="Enter Folder Name" bind:value={new_folder} bind:inputEl />
        <Button type="submit" {...dialogBtnStyle} outlineWidth="2px" width="fit-content"><span>Insert</span></Button>
      </form>
      <div class="inner">
        <ul>
          {#if page === "creation"}
            {#each folders as folder (folder)}
              <FolderCard {...folder} />
            {/each}
          {:else if page === "selection"}
            {#each conversations as convo}
              <ConversationListItem {...convo} />
            {/each}
          {:else if page === "submit"}
            <button>submit</button>
          {/if}
        </ul>
      </div>
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button {...dialogBtnStyle} class="error" on:click={handleDiscardClick}>
      <span>
        {languageObj.discard ?? "abort"}
      </span>
    </Button>

    <Button {...dialogBtnStyle} on:click={handleProceedClick}>
      {#if page === pages.at(-1)}
        <span> save </span>
      {:else}
        <span> next </span>
      {/if}
    </Button>
  </svelte:fragment>
</Dialog>

<style>
  .active {
    color: bisque;
    font-weight: 800;
    text-transform: uppercase;
    font-family: monospace;
  }

  aside ul li {
    cursor: pointer;
  }

  .inner {
    height: 100%;
    position: relative;
    border-radius: 6px;
    overflow-y: scroll;

    background: var(--main-surface-background);
  }

  .inner > ul {
    position: absolute;
    inset: 0;
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
    height: fit-content;
  }

  ul > li {
    height: 2rem;
    padding: 0.25rem;
    border-radius: 6px;
  }

  .main {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 1fr;
    width: 100%;
  }
</style>
