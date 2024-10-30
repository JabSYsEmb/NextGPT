<script>
  import { auth } from "../../stores";

  /**@type {Array<import('../types.d').SaveBtnOptionType>}*/
  export let options;
  export let convo_id;

  /**
   * @param {string} format
   */
  async function onClick(format) {
    return (e) => {
      e.preventDefault();
      console.log(format, $auth);
    };
  }

  console.log(`[save-as-btn-main.svelte]: unimplemented yet - ${convo_id}!`);
</script>

<div id="save-as-btn" class="min-w-fit" data-state="open">
  {convo_id}
  {#each options as { format, Icon, available } (format)}
    <button on:click={onClick(format)}>
      {#if available}
        <span>{format} <span class="feature-soon"></span> </span>
      {:else}
        <span>{format}</span>
      {/if}
      <svelte:component this={Icon} />
    </button>
  {/each}
</div>

<!-- 
    async function addSaveAsBtnToConvo() {
    await customQuerySelector('button[data-testid="share-chat-button"]')
      .then((el) => {
        if (document.querySelector("#chatty-share-btn")) return;

        const options = Object.entries(downloadOptions).map(
          ([option, { icon, available }]) =>
            `<div role="button" id="${option}-option"
              class="relative flex items-center m-1.5 p-2.5 text-sm cursor-pointer focus-visible:outline-0 hover:bg-[#f5f5f5] focus-visible:bg-[#f5f5f5] dark:hover:bg-token-main-surface-secondary dark:focus-visible:bg-token-main-surface-secondary rounded-md my-0 px-3 mx-2 dark:radix-state-open:bg-token-main-surface-secondary gap-2.5 py-3 !pr-3" >
              <div class="flex grow items-center justify-between gap-2">
                  <div>
                      <div class="flex items-center gap-3">
                          ${icon}
                          <div>${option}</div>
                      </div>
                  </div>
              </div>
              ${available ? "" : `<span class="feature-soon">${langObj.soon}</span>`}
            </div>`
        );

        const toInjectDOM = HTML_DOCUMENT_PARSER.parseFromString(
          `
          <button id="chatty-share-btn" data-state="close" >
            <div>${langObj.save_as}</div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="icon-md text-token-text-tertiary chattay-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z" fill="currentColor"></path></svg>
          </button>
          `,
          "text/html"
        );
        const share_btn = toInjectDOM.body.firstElementChild;

        const holder = `
        <div role="menu"
            id="chatty-share-options"
            class="absolute z-50 max-w-xs rounded-2xl popover hidden bg-token-main-surface-primary shadow-lg border border-token-border-light py-2 min-wk-[60px]">
            ${options.join("\n")}
        </div>
      `;

        const optionsHolderDOM = HTML_DOCUMENT_PARSER.parseFromString(holder, "text/html");
        const optionsHolder = optionsHolderDOM.body.firstElementChild;

        share_btn.append(optionsHolder);
        share_btn.classList = el.classList;

        function stateToggler() {
          optionsHolder.classList.toggle("hidden");
          share_btn.dataset.state = share_btn.dataset.state === "open" ? "close" : "open";

          function clickOutsideSaveAsBtn(event) {
            if (share_btn.dataset.state === "close") return;

            if (!event.composedPath().includes(share_btn)) {
              share_btn.dataset.state = "close";
              optionsHolder.classList.add("hidden");
              document.removeEventListener("click", clickOutsideSaveAsBtn);
            }
          }

          document.addEventListener("click", clickOutsideSaveAsBtn);
        }

        share_btn.addEventListener("click", injectSaveAsBtn, { once: true });

        share_btn.addEventListener("click", stateToggler);

        el.insertAdjacentElement("beforebegin", share_btn);
      })
      .catch((e) => `chatty-ext: ${console.error(e)}`);

    //
  }
}
-->

<style>
  /* div[data-state="open"] {
    background-color: var(--main-surface-secondary) !important;
  }

  div {
    display: flex;
    width: 100px;
    height: 200px;

    border-radius: 20px;

    top: 120%;
    right: 50%;
    transform: translateX(50%);
  }

  span.feature-soon {
    letter-spacing: 1px;
    font-weight: 500;
    position: absolute;
    inset-inline-end: 5%;
    inset-block-end: 5%;
    background-color: oklch(0.39 0.4 30.9);
    font-size: small;
    height: 1em;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 4px;
    padding-inline: 0.2em;
    width: fit-content;
  } */
</style>
