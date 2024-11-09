<script>
  import { FolderIcon } from "../../../icons";
  export let name;
  export let id;
</script>

<li>
  <span class="icon">
    <FolderIcon />
  </span>
  <span class="title">
    {name}
    <span class="footer">{new Date(id).toLocaleDateString()}</span>
  </span>
</li>

<style>
  li {
    position: relative;
    display: grid;
    grid-template-columns: 30px 1fr;
    margin-block: 0.15rem;
    align-items: stretch;
    overflow: hidden;
    min-width: 0;

    height: 2.5rem;
    cursor: pointer;
    border-radius: 0.125rem;

    text-overflow: ellipsis;
    transition: all 200ms ease-in-out;
    outline: 1px solid var(--border-medium);
  }

  li:hover {
    background-color: var(--sidebar-surface-secondary);
  }

  li:is(:focus, :focus-visible, :focus-within) {
    outline: 2px solid hsla(234, 44%, 45%);
    outline-offset: -0.5px;
    background-color: hsla(234, 44%, 45%, 0.266);
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

  span.footer {
    position: absolute;
    inset-inline-end: 6px;
    inset-block-end: 2px;
    font-size: x-small;
    font-weight: 800;
    font-family: monospace;
    color: var(--text-tertiary);
    line-height: 2ch;
  }
</style>
