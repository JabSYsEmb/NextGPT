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
  import { Input } from "../../../components";

  /**@type {import('../../../../types.d').DataItemType}*/
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
    class="popover relative bg-token-main-surface-primary text-start rounded-2xl shadow-xl overflow-hidden md:max-w-[680px]"
    bind:this={dialog}
    on:close={fireCloseEvent}
  >
    <div class="dialog__main-div">
      <div class="dialog__header-div px-2 pb-4 pt-5 sm:p-4 flex">
        <RenameIcon />
        <span class="dialog__title-span">{languageObj.rename}</span>
      </div>
      <form
        on:submit={(e) => {
          e.preventDefault();
          handleRenameSave();
        }}
      >
        <label for="rename-input">
          <Input class="w-full" bind:value={title} id="rename-input" />
        </label>
      </form>
      <div class="dialog__footer-div">
        <button class="dialog-btn" on:click={handleRenameSave}>
          <span class="dialog__btn_span">
            {#if $loading === "saving"}
              <LoadingIdicatorIcon />
            {:else}
              {languageObj.save}
            {/if}
          </span>
        </button>
        <button class="dialog-btn error" on:click={() => dialog.close()}>
          <span class="dialog__btn_span">
            {languageObj.discard}
          </span>
        </button>
      </div>
    </div>
  </dialog>
{/key}

<style>
  .dialog__header-div {
    color: var(--text-tertiary);
    justify-content: flex-start;
    gap: 0.5rem;
  }

  .dialog__footer-div {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    gap: 1rem;
  }

  .label--title {
    text-transform: uppercase;
    margin-block: 0.5rem;
  }

  .dialog__main-div > form {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .dialog-btn {
    width: 95px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;

    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-secondary);
    padding-inline: 0.5rem;
    border-radius: 10px;
    border: 2px solid var(--border-light);
    transition: all 100ms ease-in;
    background-color: var(--border-medium);
  }

  .dialog-btn:hover {
    color: var(--main-surface-primary);
    background-color: var(--text-primary);
  }

  button.error {
    background-color: hsl(from var(--text-danger) h s calc(l - 10) / 0.5);
  }

  .dialog-btn.error:hover {
    background-color: var(--text-danger);
    color: var(--text-primary);
  }

  .dialog__title-input {
    width: 75%;
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-light);
    border-radius: 0.5rem;
    margin: 1rem 0;
  }

  .dialog__title-span {
    text-transform: capitalize;
    font-size: 1.25rem;
    font-weight: 500;
  }

  dialog {
    max-width: 80vi;
    width: 480px;
    height: 200px;
    padding-block: 0.25rem;
    padding-inline: 0.75rem;
  }

  .dialog__main-div {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-rows: 40px 1fr 60px;
    justify-content: stretch;
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
