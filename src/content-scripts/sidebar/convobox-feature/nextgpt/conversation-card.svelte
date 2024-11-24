<script>
  import ConversationContextmenu from "./conversation-contextmenu.svelte";
  import { ChatgptConvoIcon, ChatgptArchiveConvoIcon } from "../../../../icons";
  import { shallowTo } from "../../../utils";
  import { getConvoIdFromURL } from "../../../../utils/utils";
  import { url } from "../../../../stores";

  /**@type {import('../../../types.d').DataItemType}*/
  export let item;

  function useAnchor(node) {
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
  <a id={item.id} href="/c/{item.id}" tabindex="0" use:useAnchor>
    <span class="icon">
      <svelte:component this={item.is_archived ? ChatgptArchiveConvoIcon : ChatgptConvoIcon} />
    </span>
    <span class="title">
      {item.title || item.id}
    </span>
  </a>
  <div
    class="absolute bottom-0 top-0 to-transparent right-0 bg-gradient-to-l from-token-sidebar-surface-primary w-8 from-0%"
  ></div>
  <div class="dropdown--container">
    <button>&dotsquare;</button>
  </div>
</li>

<style>
  li:is(.active, :hover) div.to-transparent {
    --tw-gradient-from: var(--sidebar-surface-secondary) var(--tw-gradient-from-position);
    --tw-gradient-to: hsla(0, 0%, 100%, 0) var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
    --tw-gradient-from-position: 60%;
  }

  li {
    position: relative;
    margin-block: 0.15rem;
    min-width: 0;
    border-radius: 4px;
    border: 1px solid var(--border-medium);
    background-color: var(--sidebar-surface-primary);

    height: 2.5rem;
    cursor: pointer;
  }

  li.active {
    border-color: hsla(234, 44%, 45%);
  }

  li:is(:focus, :focus-visible, :focus-within) {
    border-color: hsla(234, 44%, 45%);
  }

  li:is(:hover, .active) {
    background-color: var(--sidebar-surface-secondary);
  }

  .dropdown--container {
    display: none;

    position: absolute;
    justify-content: center;
    align-items: center;
    background: transparent;
    right: 0.5rem;
    outline: 1px solid saddlebrown;
    top: 50%;
    width: fit-content;
    height: 50%;
    transform: translateY(-50%);
  }
  li:is(:hover, .active) .dropdown--container {
    display: flex;
  }

  a {
    display: grid;
    grid-template-columns: 30px 1fr;
    align-items: stretch;

    overflow: hidden;
    white-space: nowrap;

    height: 100%;
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
