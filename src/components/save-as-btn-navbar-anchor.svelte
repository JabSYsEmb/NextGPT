<script context="module">
  import { auth } from "../store";
</script>

<script>
  import { ArrowIcon } from "../icons";

  export let langObj;
  export let url;
  /**@type {Array<{format: string, Icon: HTMLElement}>}*/
  export let options;

  let className =
    "flex items-center m-1.5 p-2.5 text-sm cursor-pointer focus-visible:outline-0 hover:bg-[#f5f5f5] focus-visible:bg-[#f5f5f5] dark:hover:bg-token-main-surface-secondary dark:focus-visible:bg-token-main-surface-secondary rounded-md my-0 px-3 mx-2 dark:radix-state-open:bg-token-main-surface-secondary gap-2.5 py-3 !pr-3";

  let subListClassName =
    "sub-list absolute z-50 max-w-xs rounded-2xl popover bg-token-main-surface-primary shadow-lg border border-token-border-light py-2 min-wk-[60px]";

  export { className as class };

  async function hydrate(/**@type {HTMLElement}*/ node, { format }) {
    node.addEventListener("click", onClick);
    async function onClick() {
      if (!format) return;

      console.log(url, format, $auth);
      // const data = await fetch(`/backend-api/conversation/${url}`, $auth).then((res) => res.json());

      // chrome.runtime.sendMessage({
      //   action: "export",
      //   data,
      //   format: node.dataset.format,
      // });

      const pointerDownEvent = new MouseEvent("pointerdown", {
        bubbles: true,
        view: window,
        cancelable: true,
      });

      document.body.dispatchEvent(pointerDownEvent);
    }

    return {
      destroy() {
        node.removeEventListener("click", onClick);
      },
    };
  }
</script>

<div
  role="menuitem"
  id="download-option"
  class="flex items-center m-1.5 p-2.5 text-sm cursor-pointer focus-visible:outline-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 group relative hover:bg-[#f5f5f5] focus-visible:bg-[#f5f5f5] radix-state-open:bg-[#f5f5f5] dark:hover:bg-token-main-surface-secondary dark:focus-visible:bg-token-main-surface-secondary rounded-md my-0 px-3 mx-2 dark:radix-state-open:bg-token-main-surface-secondary gap-2.5 py-3"
>
  <div class="icon__menu-div">
    <ArrowIcon />
  </div>
  <span>{langObj.save_as}</span>

  <div class="test {subListClassName}">
    {#each options as { format, Icon } (format)}
      <div role="button" class={className} id="{format}-option" use:hydrate={{ format }}>
        <div class="option__outer-div">
          <div class="option__inner-div"><Icon /> {format}</div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .test {
    left: 100px;
    top: 500px;
    z-index: 2;
    width: fit-content;
    height: fit-content;
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

    &::after {
      content: "";
      position: absolute;

      right: 0;
      top: 0;
      transform: translate(100%, 10%);
      width: 40px;
      height: 140%;
      z-index: -1;
    }

    & > div.sub-list {
      visibility: hidden;
      left: 100%;
      transform: translateX(15%);
      top: 0%;
    }

    &:hover > div.sub-list {
      visibility: visible;
    }

    & svg {
      transition: rotate 0.3s ease-in-out;
    }

    &:hover svg {
      rotate: 90deg;
    }

    &:hover .sub-list svg {
      rotate: 0deg;
    }
  }

  :global([data-radix-menu-content]:has(#download-option)) {
    overflow: visible !important;
  }
</style>
