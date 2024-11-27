<script>
  import { ChatgptConvoIcon, ChatgptArchiveConvoIcon, ThreeDotsIcon } from "../../../../icons";
  import { shallowTo } from "../../../utils";
  import { getConvoIdFromURL } from "../../../../utils/utils";
  import { url } from "../../../../stores";
  import { createEventDispatcher } from "svelte";

  /**@type {import('../../../types.d').DataItemType}*/
  export let item;

  /**@type {boolean}*/
  export let dropdownOpen;

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

  const dispatch = createEventDispatcher();

  function handleMenuBtnClick(/**@type {HTMLElement}*/ node) {
    function onClick() {
      const { x, y, width, height } = node.getBoundingClientRect();
      dispatch("menucontext", {
        convoId: item.id,
        x: x - width / 2,
        y: y + height + 1,
        is_archived: item.is_archived,
        title: item.title,
      });
    }
    node.addEventListener("click", onClick);
    return {
      destroy() {
        node.removeEventListener("click", onClick);
      },
    };
  }
</script>

<li class:active={getConvoIdFromURL($url) === item.id} class:dropdown-open={dropdownOpen}>
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
    <button tabindex="-1" use:handleMenuBtnClick>
      <ThreeDotsIcon />
    </button>
  </div>
</li>

<style>
  .dropdown-open .dropdown--container {
    display: flex;
  }

  li:is(.active, :hover) div.to-transparent {
    --tw-gradient-from: var(--sidebar-surface-secondary) var(--tw-gradient-from-position);
    --tw-gradient-to: hsla(0, 0%, 100%, 0) var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
    --tw-gradient-from-position: 60%;
  }

  li {
    position: relative;
    min-width: 0;
    border-radius: 0.25rem;
    overflow: hidden;
    border: 1px solid var(--border-medium);
    background-color: var(--sidebar-surface-primary);

    height: 2.75rem;
    cursor: pointer;
  }

  li:is(:focus, :focus-visible, :focus-within, .active) {
    border-color: light-dark(rgb(159, 168, 255), hsla(234, 44%, 45%));
  }

  li.dropdown-open:not(.active):focus-within {
    border-color: var(--border-medium);
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

  button {
    display: flex;
    height: 80%;
    width: auto;
    aspect-ratio: 1/1;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
</style>
