<script>
  import { ChatgptConvoIcon, ChatgptArchiveConvoIcon } from "../../../icons";
  import { shallowTo } from "../../utils";
  import { getConvoIdFromURL } from "../../../utils/utils";
  import { url } from "../../../stores";

  /**@type {import('../../../types.d').DataItemType}*/
  export let item;

  function useAnchor(node, item) {
    function clickHandler(e) {
      e.preventDefault();
      e.stopPropagation();

      shallowTo(node.href);
    }

    node.addEventListener("click", clickHandler);

    return {
      destroy() {
        node.removeEventListener("click", clickHandler);
      },
    };
  }
</script>

<li class:active={getConvoIdFromURL($url) === item.id}>
  <a id={item.id} href="/c/{item.id}" tabindex="0" use:useAnchor={item}>
    <span class="icon">
      <svelte:component this={item.is_archived ? ChatgptArchiveConvoIcon : ChatgptConvoIcon} />
    </span>
    <span class="title">
      {item.title || item.id}
    </span>
  </a>
</li>

<style>
  li {
    margin-block: 0.15rem;
    min-width: 0;
    border-radius: 0.125rem;
    outline: 1px solid var(--border-medium);
    background-color: var(--sidebar-surface-primary);

    height: 2.5rem;
    transition: all 200ms ease-in-out;
    cursor: pointer;
  }

  a {
    display: grid;
    grid-template-columns: 30px 1fr;
    align-items: stretch;

    height: 2.5rem;
  }

  li:hover,
  li.active {
    background-color: var(--sidebar-surface-secondary);
  }

  li.active {
    outline: 2px solid hsla(234, 44%, 45%);
  }

  li:is(:focus, :focus-visible, :focus-within) {
    outline: 2px solid hsla(234, 44%, 45%);
    outline-offset: -0.5px;
    background-color: hsla(234, 44%, 45%, 0.266);
  }

  li.active:is(:focus, :focus-visible, :focus-within) {
    outline: 2px solid var(--text-error);
    outline-offset: -0.5px;
    background-color: hsla(0, 44%, 45%, 0.266);
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

  :global(.drag-over) {
    outline: 2px dashed orangered !important;
  }
</style>
