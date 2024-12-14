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
  <div class="dialog__main">
    <div class="dialog__header-div px-2 pb-4 pt-5 sm:p-4 flex">
      <slot name="header"></slot>
    </div>

    <div class="dialog__content-div">
      <slot name="content"></slot>
    </div>

    <div class="dialog__footer-div">
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
    grid-template-rows: 40px 1fr 60px;
    width: 100%;
    height: 100%;
  }

  .dialog__header-div {
    color: var(--text-secondary);
    justify-content: flex-start;
    align-items: center;
    gap: 0.5rem;
    height: 100%;
  }

  .dialog__footer-div {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    gap: 1rem;
    min-height: fit-content;
    padding-block: 0.5rem;
  }

  .dialog__content-div {
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
