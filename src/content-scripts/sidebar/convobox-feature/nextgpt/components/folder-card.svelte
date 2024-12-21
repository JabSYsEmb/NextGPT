<script>
  import { DragIcon, FolderIcon } from "../../../../../icons";
  import { ConversationListItem } from "../../../../components";

  export let folder;
  export let children = [];
  const { title, newItem } = folder;
</script>

<li draggable="true" class:extended={children.length}>
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

{#if children.length}
  <ul class="content">
    {#each children as children (children.id)}
      <ol>
        <ConversationListItem {...children} />
      </ol>
    {/each}
  </ul>
{/if}

<style>
  ol {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;

    background-color: var(--sidebar-surface-primary);
    cursor: pointer;

    border-radius: 0.25rem;
    overflow: hidden;
    border: 1px solid var(--border-medium);
  }

  .content {
    min-width: 0;

    padding-inline-start: 1.25rem;
    padding-inline-end: 0.25rem;

    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background-color: var(--sidebar-surface-secondary);
    border-radius: 0.5rem;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    padding-block: 0.25rem;
    border: 1px solid var(--border-medium);
    border-top: none;
  }

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

    align-items: stretch;
    overflow: hidden;
    min-width: 0;

    min-height: 2.5rem;
    height: max-content;
    cursor: pointer;
    border-radius: 0.25rem;

    text-overflow: ellipsis;
    transition: all 200ms ease-in-out;
    border: 1px solid var(--border-medium);
    background: var(--main-surface-background);
    margin-block: 0.125rem;
  }

  li.extended {
    margin-block-end: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
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
