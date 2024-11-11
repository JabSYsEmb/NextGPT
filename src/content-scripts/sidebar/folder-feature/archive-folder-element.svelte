<script>
  import { slide } from "svelte/transition";
  import { ArchiveFolderIcon } from "../../../icons";
  import { languageObj } from "../../../utils/index";
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
</script>

<div id="{name}-folder">
  <li class:expanded={isExpanded} use:useCollapseAction>
    <span class="icon">
      <ArchiveFolderIcon />
    </span>
    <span class="title">
      {languageObj.archive ?? "Archive"}
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
</div>

<style>
  ul {
    display: flex;
    flex-direction: column;
    max-height: 45dvh;
    overflow-y: auto;
    background-color: var(--border-light);
    padding-inline: 0.75rem 0.25rem;
    padding-block: 0.25rem 0.25rem;
    margin-block-end: 0.25rem;

    background-color: hsl(from var(--progress-color) 20 s calc(l - 10) / 0.3);
  }

  .expanded {
    margin-block-end: 0px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;

    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    background-color: hsl(from var(--progress-color) 20 calc(s + 15) calc(l - 15));
    border-bottom-color: hsl(from var(--progress-color) 20 calc(s + 15) calc(l - 15));
    color: white;
  }

  li {
    position: relative;

    display: grid;
    grid-template-columns: 30px 1fr;

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
    background-color: hsl(25 90 40 / 0.3);
  }

  li:not(.expanded):hover {
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
