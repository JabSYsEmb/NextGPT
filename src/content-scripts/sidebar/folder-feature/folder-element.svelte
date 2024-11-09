<script>
  import { slide } from "svelte/transition";
  import { FolderIcon, OpenFolderIcon } from "../../../icons";
  import ConvoAnchorElement from "./convo-anchor-element.svelte";

  export let id;
  export let name;
  export let items;

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

  console.log(items);
</script>

<li class:expanded={isExpanded} use:useCollapseAction>
  <span class="icon">
    <svelte:component this={isExpanded ? OpenFolderIcon : FolderIcon} />
  </span>
  <span class="title">
    {name}
    <span class="footer">{new Date(id).toLocaleDateString()}</span>
  </span>
</li>

{#if isExpanded}
  <ul transition:slide>
    {#each items as item (item.id)}
      <ConvoAnchorElement {item} />
    {/each}
  </ul>
{/if}

<style>
  ul {
    display: flex;
    flex-direction: column;
    background-color: var(--border-light);
    padding-inline-start: 0.75rem;
    padding-block-end: 1rem;
  }

  .expanded {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    background-color: var(--sidebar-surface-secondary);
  }

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
