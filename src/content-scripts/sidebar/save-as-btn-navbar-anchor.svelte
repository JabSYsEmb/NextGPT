<script context="module">
  import { languageObj } from "../../utils";
  import { writable } from "svelte/store";
  const loading = writable(null);
</script>

<script>
  import { ArrowIcon, CopyIcon, LoadingIdicatorIcon, TickIcon } from "../../icons";
  import OptionButton from "./option-button.svelte";
  import { delay } from "../../utils";

  export let convoId;
  /**@type {Array<{format: string, Icon: HTMLElement, label?: string}>}*/
  export let options;
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

  let isCopied = false;

  async function onCopyClick() {
    if (!convoId) return;

    const data = await fetch(`/backend-api/conversation/${convoId}`).then((res) => res.json());

    chrome.runtime.sendMessage({
      action: "copy-to-clipboard",
      data,
    });

    isCopied = true;

    delay(
      () => {
        isCopied = false;
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
  <div class="icon__menu-div">
    <ArrowIcon />
  </div>
  <span>{languageObj.save_as}</span>

  <div class="menu__sublist-div {tailwindSublistClass}" data-length={options.length} use:keepWithinViewport>
    <OptionButton label={languageObj.copy_to_clipboard} Icon={isCopied ? TickIcon : CopyIcon} on:click={onCopyClick} />
    <span></span>
    {#each options as { format, Icon, label } (format)}
      {#if format === $loading}
        <OptionButton Icon={LoadingIdicatorIcon} disabled={true} />
      {:else}
        <OptionButton
          label={label ?? format}
          {Icon}
          on:click={onClick.bind(null, format)}
          disabled={$loading === format}
        />
      {/if}
    {/each}
  </div>
</div>

<style>
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
    visibility: hidden;

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
