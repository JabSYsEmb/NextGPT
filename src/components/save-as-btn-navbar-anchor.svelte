<script context="module">
  import { auth } from "../stores";
</script>

<script>
  import { ArrowIcon } from "../icons";

  export let langObj;
  export let url;
  /**@type {Array<{format: string, Icon: HTMLElement}>}*/
  export let options;

  let className;

  export { className as class };

  async function useOption(/**@type {HTMLElement}*/ node, { format }) {
    async function onClick() {
      const convoId = url.match(/[a-fA-F0-9-]{36}/)[0];
      if (!format || !convoId) return;

      const data = await fetch(`/backend-api/conversation/${convoId}`, $auth).then((res) => res.json());

      chrome.runtime.sendMessage({
        action: "export",
        data,
        format,
      });

      const pointerDownEvent = new MouseEvent("pointerdown", {
        bubbles: true,
        view: window,
        cancelable: true,
      });

      document.body.dispatchEvent(pointerDownEvent);
    }

    node.addEventListener("click", onClick);

    return {
      destroy() {
        node.removeEventListener("click", onClick);
      },
    };
  }

  const className1 =
    "flex items-center m-1.5 p-2.5 text-sm cursor-pointer focus-visible:outline-0 hover:bg-[#f5f5f5] focus-visible:bg-[#f5f5f5] dark:hover:bg-token-main-surface-secondary dark:focus-visible:bg-token-main-surface-secondary rounded-md my-0 px-3 mx-2 dark:radix-state-open:bg-token-main-surface-secondary gap-2.5 py-3 !pr-3";

  const tailwindSublistClass =
    "popover bg-token-main-surface-primary shadow-lg border border-token-border-light min-wk-[60px]";
</script>

<div role="menuitem" id="download-option" class={className}>
  <div class="icon__menu-div">
    <ArrowIcon />
  </div>
  <span>{langObj.save_as}</span>

  <div class="menu__sublist-div {tailwindSublistClass}">
    {#each options as { format, Icon } (format)}
      <div role="button" class={className1} id="{format}-option" use:useOption={{ format }}>
        <div class="option__outer-div">
          <div class="option__inner-div"><Icon /> {format}</div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .menu__sublist-div {
    visibility: hidden;
    left: 100%;
    transform: translateX(15%);
    top: 0%;

    z-index: 1;
    border-radius: 1rem;
    max-width: 20rem;
    position: absolute;
    padding-block: 0.5rem;
    width: fit-content;
    height: fit-content;

    transition: all 0.2s ease-in-out;
  }

  .option__inner-div,
  .icon__menu-div,
  .option__outer-div {
    display: flex;
    align-items: center;
  }

  .option__outer-div {
    flex-grow: 1;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .option__inner-div {
    gap: 0.75rem;
  }

  .icon__menu-div {
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

  #download-option:hover :global(svg) {
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
