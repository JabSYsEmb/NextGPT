<script context="module">
  import { languageObj } from "../../../../../utils";
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
  } from "../../../../../icons";
  import { OptionButton, Button, Dialog } from "../../../../components";
  import { delay } from "../../../../../utils";
  import { getArchiveButton } from "./../index";
  import { shallowTo } from "../../../../utils";
  import { createEventDispatcher } from "svelte";
  import { Input } from "../../../../components";

  /**@type {import('../../../../../types.d').DataItemType}*/
  export let item;

  /**@type {number}*/
  export let x;
  /**@type {number}*/
  export let y;

  let className;
  export { className as class };

  let ClipBoardIcon = CopyIcon;
  async function handleCopy() {
    if (!item.id) return;

    ClipBoardIcon = CicleBubbleLoadingIcon;
    const data = await fetch(`/backend-api/conversation/${item.id}`).then((res) => res.json());

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
      if (![node, dialog].some((n) => e.composedPath().includes(n))) fireCloseEvent();
    }

    document.addEventListener("pointerdown", clickOutside);
    cleanup_callbacks.push(() => document.removeEventListener("pointerdown", clickOutside));
  }

  async function handleArchive(/**@type {MouseEvent}*/ e) {
    e.stopPropagation();
    $loading = "archiving";

    if (item.is_archived && window.location.pathname.includes(item.id)) {
      const btn = getArchiveButton();

      if (btn) {
        btn.click();
        item.is_archived = !item.is_archived;
        return fireCloseEvent();
      }
    }

    try {
      await fetch(`/backend-api/conversation/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_archived: !item.is_archived }),
      });
      requestIdleCallback(() => {
        item.is_archived = !item.is_archived;
        if (window.location.pathname.includes(item.id)) window.location.reload();
      });
    } catch (_e) {}

    fireCloseEvent();
  }

  async function handleDelete(/**@type {MouseEvent}*/ e) {
    e.stopPropagation();

    $loading = "deleting";

    try {
      await fetch(`/backend-api/conversation/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_visible: false }),
      });
      requestIdleCallback(() => {
        if (window.location.pathname.includes(item.id)) shallowTo("/");
      });

      fireCloseEvent();
    } catch (_e) {}
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

  let title = item.title;

  async function handleRenameSave() {
    $loading = "saving";

    try {
      await fetch(`/backend-api/conversation/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title }),
      });
      $loading = null;
    } catch (_) {}

    if ($loading !== "saving") dialog.close();
  }

  const tailwindSublistClass = "popover bg-token-main-surface-primary shadow-lg border border-token-border-light";

  const dialogBtnStyle = {
    width: "12ch",
    height: "100%",
    borderWidth: "1px",
    borderRadius: "10px",
  };
</script>

{#key item.id}
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
      {:else if item.is_archived}
        <OptionButton label={languageObj.dearchive} Icon={UnarchiveActionIcon} on:click={handleArchive} />
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

  <Dialog bind:dialog on:close={fireCloseEvent}>
    <svelte:fragment slot="header">
      <RenameIcon />
      <span class="dialog__title-span">{languageObj.rename}</span>
    </svelte:fragment>

    <form
      slot="content"
      class="self-center w-full"
      on:submit={(e) => {
        e.preventDefault();
        handleRenameSave();
      }}
    >
      <label for="rename-input">
        <Input class="w-full" bind:value={title} id="rename-input" />
      </label>
    </form>

    <svelte:fragment slot="footer">
      <Button {...dialogBtnStyle} class="error" on:click={() => dialog.close()}>
        <span>
          {languageObj.discard}
        </span>
      </Button>

      <Button class={$loading === "saving" ? "inaction" : ""} {...dialogBtnStyle} on:click={handleRenameSave}>
        <span>
          {#if $loading === "saving"}
            <LoadingIdicatorIcon />
          {:else}
            {languageObj.save}
          {/if}
        </span>
      </Button>
    </svelte:fragment>
  </Dialog>
{/key}

<style>
  .dialog__title-span {
    text-transform: capitalize;
    font-size: 1.25rem;
    font-weight: 500;
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
    top: 0;

    z-index: 1;
    border-radius: 1rem;
    position: absolute;
    padding-block: 0.5rem;
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
