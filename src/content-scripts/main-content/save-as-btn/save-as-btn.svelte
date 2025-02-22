<script context="module">
  import { languageObj, delay } from "../../../utils";
  import { writable } from "svelte/store";
  const clickedId = writable(null);
</script>

<script>
  import { LoadingIdicatorIcon, ArrowIcon } from "../../../icons";
  import { OptionButton } from "../../components";
  import { slide } from "svelte/transition";

  /**@type {Array<import('../../types.d').SaveBtnOptionType>}*/
  export let options;
  export let convo_id;
  export { className as class };

  /**
   * @param {string} format
   * @param {number} id
   */
  function onClick(format, id) {
    return async function (/**@type {MouseEvent}*/ e) {
      e.stopPropagation();
      clickedId.set(id);
      const data = await fetch(`/backend-api/conversation/${convo_id}`).then((res) => res.json());
      chrome.runtime.sendMessage({ action: "export", format, data });

      // artificial delay needed for the backend to process the request
      if (format.toLocaleLowerCase() === "pdf") return delay(() => clickedId.set(null), { ms: 1200 });

      clickedId.set(null);
    };
  }

  function onSaveAsBtnClick(/**@type {MouseEvent} */ e) {
    e.stopPropagation();
    isOpen = !isOpen;
  }

  function useClickOutSide() {
    function handleOutSideClick() {
      if ($clickedId !== null) return;
      isOpen = false;
      document.removeEventListener("click", handleOutSideClick);
    }

    document.addEventListener("click", handleOutSideClick);

    return {
      destroy() {
        document.removeEventListener("click", handleOutSideClick);
      },
    };
  }

  function handleLoadingState(/**@type {MouseEvent}*/ e) {
    if ($clickedId !== null) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
    return;
  }

  let isOpen = false;
  let className = "btn relative btn-secondary text-token-text-primary";

  const availableOptions = options.filter(({ available }) => available);
  const soonOptions = options.filter(({ available }) => !available);
</script>

<button
  id="save-as-btn"
  class:open={isOpen}
  class={className}
  on:click={onSaveAsBtnClick}
  on:click|capture={handleLoadingState}
>
  {languageObj.save_as}
  <ArrowIcon style="rotate: {isOpen ? '-90deg' : '90deg'};transition: rotate 200ms ease-in-out;" />
  {#if isOpen}
    <ul class="shadow-lg" transition:slide={{ duration: 300 }} use:useClickOutSide>
      {#each availableOptions as { format, Icon, label }, id (format)}
        {#if $clickedId === id}
          <OptionButton Icon={LoadingIdicatorIcon} disabled />
        {:else}
          <OptionButton label={label ?? format} {Icon} on:click={onClick(format, id)} />
        {/if}
      {/each}
      <span class="divider"></span>
      {#each soonOptions as { format, Icon, label } (format)}
        <OptionButton class="disabled" label={label ?? format} {Icon} disabled>
          <span class="feature-soon">soon</span>
        </OptionButton>
      {/each}
    </ul>
  {/if}
</button>

<style>
  .divider {
    height: 1px;
    background-color: var(--border-light);
    margin-block: 0.25rem;
    width: 90%;
    margin-inline: auto;
  }

  #save-as-btn {
    display: flex;
    justify-content: stretch;
    position: relative;
    gap: 0.5rem;
    min-width: 10ch;
    width: max-content;
    height: 100%;
  }

  #save-as-btn.open {
    background-color: var(--main-surface-secondary);
  }

  ul :global(button:hover) {
    background-color: light-dark(rgb(245 245 245), var(--main-surface-tertiary)) !important;
  }

  ul {
    padding-block: 0.5rem;
    border: 1px solid var(--border-light);
    border-radius: 1rem;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    top: 120%;
    left: 50%;
    min-width: fit-content;
    width: 9rem;
    transform: translateX(-50%);
    background-color: light-dark(var(--main-surface-primary), var(--main-surface-secondary));
  }

  span.feature-soon {
    letter-spacing: 1px;
    font-weight: 500;
    position: absolute;
    inset-inline-end: 1px;
    inset-block-end: 1px;
    background-color: oklch(0.39 0.4 30.9);
    font-size: small;
    height: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0.2em;
    width: fit-content;
    color: whitesmoke;
    font-weight: 600;
    border-bottom-right-radius: 4px;
    overflow: hidden;
  }

  button:active {
    opacity: 1;
  }
</style>
