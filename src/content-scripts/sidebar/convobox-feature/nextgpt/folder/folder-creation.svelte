<script>
  import { RenameIcon } from "../../../../../icons";
  import { Input, Button } from "../../../../components";
  import FolderCard from "./../components/folder-card.svelte";

  export let dialogBtnStyle;
  export let submitted;
  export let nfolder;
  export let folders = [];

  let folder_name = nfolder?.name ?? undefined;
  let inputEl;
</script>

<form
  class="flex gap-2 relative"
  on:submit={(e) => {
    e.preventDefault();
    if (!folder_name || folder_name === "") return;

    if (submitted) {
      submitted = false;
      return;
    }

    submitted = true;

    nfolder = { name: folder_name };
  }}
>
  <Input
    class="grow"
    type="text"
    placeholder="Enter Folder Name"
    disabled={submitted}
    bind:value={folder_name}
    bind:inputEl
  />
  <Button type="submit" {...dialogBtnStyle} outlineWidth="2px" width="fit-content">
    {#if submitted}
      <span class="flex items-center gap-1">
        <RenameIcon /> Edit
      </span>
    {:else}
      <span>Insert</span>
    {/if}
  </Button>
</form>

<div class="inner">
  <ul>
    {#each [...folders, nfolder].filter(Boolean) as folder (folder)}
      <FolderCard {...folder} bgcolor={"red"} />
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
    outline: 1px solid var(--border-xheavy);
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
</style>
