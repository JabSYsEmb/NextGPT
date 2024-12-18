<script>
  import { DragIcon, FolderIcon } from "../../../../../icons";

  export let name;
</script>

<li draggable="true">
  <div class="holder">
    <DragIcon />
  </div>
  <span class="icon">
    <FolderIcon />
  </span>
  <span class="title"> {name ?? "New-Folder"} </span>
</li>

<style>
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
