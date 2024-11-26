<script context="module">
  import { languageObj } from "../../../../utils";
  import { writable } from "svelte/store";
  const loading = writable(null);
</script>

<script>
  import {
    CopyIcon,
    TickIcon,
    CicleBubbleLoadingIcon,
    UnarchiveActionIcon,
    ArchiveActionIcon,
    RenameIcon,
    DeleteIcon,
    LoadingIdicatorIcon,
  } from "../../../../icons";
  import { OptionButton } from "../../../components";
  import { delay } from "../../../../utils";
  import { getArchiveButton } from "./index";
  import { shallowTo } from "../../../utils";
  import { createEventDispatcher } from "svelte";

  export let is_archived;
  export let convoId;
  export let x;
  export let y;

  let className;
  export { className as class };

  let ClipBoardIcon = CopyIcon;
  async function handleCopy() {
    if (!convoId) return;

    ClipBoardIcon = CicleBubbleLoadingIcon;
    const data = await fetch(`/backend-api/conversation/${convoId}`).then((res) => res.json());

    chrome.runtime.sendMessage({
      action: "copy-to-clipboard",
      data,
    });

    ClipBoardIcon = TickIcon;

    delay(
      () => {
        ClipBoardIcon = CopyIcon;
        fireCloseEvent();
      },
      { ms: 700 }
    );
  }

  const cleanup_callbacks = [];
  const scrollingEl = document.querySelector(".duration-500.relative.-mr-2");

  function keepWithinViewport(/**@type {HTMLDivElement} */ node) {
    const { bottom } = node.getBoundingClientRect();
    const { innerHeight } = window;

    if (innerHeight - bottom < 250) y -= 232;

    if (scrollingEl) {
      scrollingEl.addEventListener("scroll", fireCloseEvent);
      cleanup_callbacks.push(() => scrollingEl.removeEventListener("scroll", fireCloseEvent));
    }

    function clickOutside(/**@type {MouseEvent}*/ e) {
      if (!e.composedPath().includes(node)) fireCloseEvent();
    }

    document.addEventListener("pointerdown", clickOutside);
    cleanup_callbacks.push(() => document.removeEventListener("pointerdown", clickOutside));
  }

  async function handleArchive(/**@type {MouseEvent}*/ e) {
    e.stopPropagation();
    $loading = "archiving";

    if (is_archived && window.location.pathname.includes(convoId)) {
      const btn = getArchiveButton();

      if (btn) {
        btn.click();
        is_archived = !is_archived;
        return fireCloseEvent();
      }
    }

    try {
      await fetch(`/backend-api/conversation/${convoId}`, {
        method: "PATCH",
        body: JSON.stringify({ is_archived: !is_archived }),
      });
      requestIdleCallback(() => {
        is_archived = !is_archived;
        if (window.location.pathname.includes(convoId)) window.location.reload();
      });
    } catch (_e) {}

    fireCloseEvent();
  }

  function handleDelete(/**@type {MouseEvent}*/ e) {
    e.stopPropagation();

    $loading = "deleting";
    try {
      fetch(`/backend-api/conversation/${convoId}`, {
        method: "PATCH",
        body: JSON.stringify({ is_visible: false }),
      });
      requestIdleCallback(() => {
        if (window.location.pathname.includes(convoId)) shallowTo("/");
      });
    } catch (_e) {}
    fireCloseEvent();
  }

  const dispatch = createEventDispatcher();

  function fireCloseEvent() {
    $loading = null;
    dispatch("close");
    cleanup_callbacks.forEach((fn) => fn());
  }

  /**@type {HTMLDialogElement} dialog*/
  let dialog;

  function handleRename() {
    dialog.showModal();
  }

  const tailwindSublistClass = "popover bg-token-main-surface-primary shadow-lg border border-token-border-light";
</script>

{#key convoId}
  <div
    role="menuitem"
    id="download-option"
    class={className}
    style:--left="{x}px"
    style:--top="{y}px"
    use:keepWithinViewport
  >
    <div class="menu__sublist-div {tailwindSublistClass}">
      <OptionButton label={languageObj.copy_to_clipboard} Icon={ClipBoardIcon} on:click={handleCopy} />
      <span></span>
      <OptionButton label={languageObj.rename} Icon={RenameIcon} on:click={handleRename} />

      {#if $loading === "archiving"}
        <OptionButton Icon={LoadingIdicatorIcon} disabled />
      {:else if is_archived}
        <OptionButton label={languageObj.unarchive} Icon={UnarchiveActionIcon} on:click={handleArchive} />
      {:else}
        <OptionButton label={languageObj.archive} Icon={ArchiveActionIcon} on:click={handleArchive} />
      {/if}

      {#if $loading === "deleting"}
        <OptionButton Icon={LoadingIdicatorIcon} disabled />
      {:else}
        <OptionButton
          label={languageObj.delete}
          Icon={DeleteIcon}
          on:click={handleDelete}
          style="--text-color: var(--text-error);"
        />
      {/if}
    </div>
  </div>
  <dialog
    class="popover relative bg-token-main-surface-primary text-start rounded-2xl shadow-xl flex flex-col overflow-hidden md:max-w-[680px]"
    bind:this={dialog}
    on:close={fireCloseEvent}
  >
    working on rename functionility
  </dialog>
{/key}

<style>
  dialog {
    width: 65vb;
    height: 45vb;
    min-width: 280px;
    min-height: 360px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  dialog::backdrop {
    backdrop-filter: blur(2px);
    background-color: hsla(0, 0, 90%, 0.25);
  }

  [role="menuitem"]#download-option {
    position: fixed;
    left: var(--left, 0px);
    top: var(--top, 0px);
    transform: translate(50%, -50%);
    z-index: 999;
    background-color: red;
  }

  .menu__sublist-div > span {
    align-self: center;
    justify-self: center;
    display: inline-flex;
    width: 90%;
    height: 1px;
    margin-block: 2px;
    background-color: var(--border-light);
  }

  .menu__sublist-div {
    display: grid;
    grid-template-rows: 1fr 1px repeat(attr(data-length), 1fr);
    grid-auto-rows: auto;
  }

  .menu__sublist-div {
    /* visibility: hidden; */

    transform: translateX(1rem);
    left: 100%;
    top: 0%;

    z-index: 1;
    border-radius: 1rem;
    position: absolute;
    padding-block: 0.5rem;
  }

  .icon__menu-div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.25rem;
    width: 1.25rem;
  }

  #download-option {
    position: relative;
  }

  #download-option::after {
    content: " ";
    position: absolute;

    right: 0;
    top: 0;
    transform: translate(100%, 10%);
    width: 40px;
    height: 140%;
    z-index: -1;
  }

  #download-option :global(svg) {
    transition: rotate 0.3s ease-in-out;
  }

  #download-option:hover :global(svg) {
    rotate: 90deg;
  }

  #download-option:hover .menu__sublist-div :global(svg) {
    rotate: 0deg;
  }

  #download-option:hover > .menu__sublist-div {
    visibility: visible;
  }

  :global([data-radix-menu-content]:has(#download-option)) {
    overflow: visible !important;
  }
</style>
