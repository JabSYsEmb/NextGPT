<script>
  import { RenameIcon } from "../../../../../icons";
  import { Input, Button } from "../../../../components";
  import FolderCard from "./../components/folder-card.svelte";
  import { languageObj } from "../../../../../utils";

  export let dialogBtnStyle;
  export let nfolder;
  export let folders = [];

  let { title } = nfolder;
  let submitted = false;
</script>

<form
  class="flex gap-2 relative"
  on:submit={(e) => {
    e.preventDefault();
    if (!title || title === "") return;

    if (submitted) {
      submitted = false;
      return;
    }

    submitted = true;

    nfolder = { title, parent_node: null };
  }}
>
  <Input class="grow" type="text" placeholder="Enter Folder Name" disabled={submitted} bind:value={title} />

  <Button type="submit" {...dialogBtnStyle} outlineWidth="2px" width="fit-content">
    {#if submitted}
      <span class="flex items-center gap-1">
        <RenameIcon /> {languageObj.rename}
      </span>
    {:else}
      <span>Insert</span>
    {/if}
  </Button>
</form>

<div class="inner">
  <ul>
    {#each [{ ...nfolder, newItem: true }, ...folders].filter((item) => item.title) as folder (folder)}
      <FolderCard {folder} bgcolor={"red"} />
    {/each}
  </ul>
</div>

<style>
  .inner {
    height: 100%;
    position: relative;
    border-radius: 6px;
    overflow-y: scroll;

    background: var(--border-sharp);
    border: 1px solid var(--border-xheavy);
  }

  .inner > ul {
    position: absolute;
    inset: 0;
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: fit-content;
  }
</style>
