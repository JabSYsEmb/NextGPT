<script>
  import { DragIcon, FolderIcon } from "../../../../../icons";

  export let folder;
  const { title, newItem } = folder;
</script>

<li draggable="true">
  <div class="holder">
    <DragIcon />
  </div>
  <span class="icon">
    <FolderIcon />
  </span>
  <span class="title"> {title ?? "New Folder"} </span>
  {#if newItem}
    <span class="footer">new-item</span>
  {/if}
</li>

<style>
  .footer {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 2ch;
    background-color: rgb(173 250 29);
    color: black;
    width: fit-content;
    padding-inline: 0.35rem;
  }

  .holder {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: var(--border-xheavy);
    cursor: move;
  }

  li {
    display: grid;
    grid-template-columns: 15px 30px 1fr;

    position: relative;

    margin-block: 0.15rem;
    align-items: stretch;
    overflow: hidden;
    min-width: 0;

    min-height: 2.5rem;
    height: max-content;
    cursor: pointer;
    border-radius: 0.125rem;

    text-overflow: ellipsis;
    transition: all 200ms ease-in-out;
    outline: 1px solid var(--border-medium);
    background: var(--main-surface-background);
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span.title {
    position: relative;
    justify-content: flex-start;
    padding-inline-start: 0.25rem;
  }
</style>
