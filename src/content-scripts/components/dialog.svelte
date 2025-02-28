<script>
  /**@type {string | undefined}*/
  export let width;

  /**@type {string | undefined}*/
  export let height;

  export let dialog;
</script>

<dialog
  class="popover relative bg-token-main-surface-primary text-start rounded-2xl shadow-xl overflow-hidden md:max-w-[680px]"
  style:--dialog-width={width}
  style:--dialog-height={height}
  bind:this={dialog}
  on:close
>
  <div class="dialog__main h-full" dir="auto">
    <div class="dialog__header-div w-full px-2 pb-4 pt-5 sm:p-4 flex">
      <slot name="header"></slot>
    </div>

    <div class="dialog__content-div w-full">
      <slot name="content"></slot>
    </div>

    <div class="dialog__footer-div w-full" >
      <slot name="footer"></slot>
    </div>
  </div>
</dialog>

<style>
  dialog {
    max-width: 80vi;
    max-height: 60vb;

    width: var(--dialog-width, 480px);
    height: var(--dialog-height, 240px);

    outline: 1px solid var(--border-light);

    padding-block: 0.25rem;
    padding-inline: 0.75rem;
  }

  dialog::backdrop {
    backdrop-filter: blur(2px);
    background-color: hsla(0, 0, 90%, 0.25);
  }

  .dialog__main {
    display: grid;
    grid-template-rows: 40px calc(100% - 100px - 1rem) 60px;
    gap: 0.5rem;
  }

  .dialog__header-div {
    color: var(--text-secondary);
    justify-content: left;
    align-items: center;
    gap: 0.5rem;
  }

  .dialog__footer-div {
    display: flex;
    justify-content: right;
    gap: 1rem;
    min-height: fit-content;
    padding-block: 0.5rem;
  }

  .dialog__content-div {
    display: flex;
  }
</style>
