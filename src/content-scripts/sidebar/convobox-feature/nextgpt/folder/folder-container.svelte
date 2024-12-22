<script>
  import { slide } from "svelte/transition";
  import { FolderIcon, OpenFolderIcon } from "../../../../../icons";
  import ConversationContainer from "../components/conversation-container.svelte";

  export let title;
  export let children;

  let isExpanded = false;

  function useCollapseAction(node) {
    function handle_click() {
      isExpanded = !isExpanded;
    }
    node.addEventListener("click", handle_click);

    return {
      destroy() {
        node.removeEventListener("click", handle_click);
      },
    };
  }
</script>

<li class:expanded={isExpanded}>
  <div class="li--inner" use:useCollapseAction>
    <span class="icon">
      <svelte:component this={isExpanded ? OpenFolderIcon : FolderIcon} />
    </span>
    <span class="title">
      {title}
    </span>
  </div>
  {#if isExpanded}
    <div class="expanded-list" transition:slide>
      <ConversationContainer conversations={children} />
    </div>
  {/if}
</li>

<style>
  .expanded-list {
    padding-inline: 0.75rem 0.25rem;
    padding-block: 0.25rem 0.25rem;
    margin-block-end: 0.25rem;
  }

  .expanded > .li--inner {
    background-color: var(--border-medium);
  }

  .li--inner {
    height: 2.5rem;

    display: grid;
    grid-template-columns: 30px 1fr;
    align-items: stretch;
  }

  .expanded {
    margin-block-end: 0px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;

    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    background-color: hsl(from var(--progress-color) h calc(s + 15) calc(l - 15));
    border-bottom-color: hsl(from var(--progress-color) h calc(s + 15) calc(l - 15));
  }

  li {
    position: relative;

    overflow: hidden;
    min-width: 0;

    min-height: fit-content;
    height: max-content;
    cursor: pointer;
    border-radius: 0.25rem;

    transition: all 200ms ease-in-out;
    border: 1px solid var(--border-medium);
  }

  li:not(.expanded):hover {
    background-color: var(--sidebar-surface-secondary);
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
