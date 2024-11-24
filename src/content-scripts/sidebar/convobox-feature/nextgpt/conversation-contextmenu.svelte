<script context="module">
  import { languageObj } from "../../../../utils";
  import { writable } from "svelte/store";
  const loading = writable(null);
</script>

<script>
  import { CopyIcon, TickIcon, CicleBubbleLoadingIcon } from "../../../../icons";
  import { OptionButton } from "../../../components";
  import { delay } from "../../../../utils";

  export let convoId;

  let className;
  export { className as class };

  async function onClick(format) {
    if (!format || !convoId) return;

    loading.set(format);
    await fetch(`/backend-api/conversation/${convoId}`)
      .then((res) => res.json())
      .then((data) => {
        chrome.runtime.sendMessage({
          action: "export",
          data,
          format,
        });
      });

    dispatchMouseEvent("pointerdown");

    loading.set(null);
  }

  let ClipBoardIcon = CopyIcon;

  async function onCopyClick() {
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
        dispatchMouseEvent("pointerdown");
      },
      { ms: 700 }
    );
  }

  /**
   *
   * @param {string} type
   */
  function dispatchMouseEvent(type) {
    const pointerDownEvent = new MouseEvent(type, {
      bubbles: true,
      view: window,
      cancelable: true,
    });

    document.body.dispatchEvent(pointerDownEvent);
  }

  function keepWithinViewport(/**@type {HTMLDivElement} */ node) {
    const { bottom } = node.getBoundingClientRect();
    const { innerHeight } = window;

    if (bottom > innerHeight) {
      node.style.transform = `translate(1rem, -${bottom - innerHeight + 8}px)`; // 16px => 0.5rem
    }
  }

  const tailwindSublistClass = "popover bg-token-main-surface-primary shadow-lg border border-token-border-light";
</script>

<div role="menuitem" id="download-option" class={className}>
  <div class="menu__sublist-div {tailwindSublistClass}" data-length={5} use:keepWithinViewport>
    <OptionButton label={"export"} on:click={onCopyClick} />
    <span></span>
    <OptionButton label={"rename"} on:click={onCopyClick} />
    <OptionButton label={"archive"} on:click={onCopyClick} />
    <OptionButton label={"delete"} on:click={onCopyClick} />
  </div>
</div>

<style>
  [role="menuitem"]#download-option {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
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
