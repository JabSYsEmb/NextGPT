<script>
  import { ConversationListItem } from "../../../../components";

  export let conversations;
  export let nfolder;
</script>

<span>{(nfolder?.items ?? []).length} items selected for "{nfolder?.title}"</span>

<div class="inner">
  <fieldset disabled={!nfolder}>
    {#each conversations ?? [] as convo}
      <label>
        <ConversationListItem {...convo} />
        {#if nfolder}
          <input type="checkbox" value={convo.id} bind:group={nfolder.items} />
        {/if}
      </label>
    {/each}
  </fieldset>
</div>

<style>
  label {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;

    background-color: var(--sidebar-surface-primary);
    cursor: pointer;

    border-radius: 0.25rem;
    overflow: hidden;
    border: 1px solid var(--border-medium);
  }

  label:has(:checked) {
    border-color: var(--border-xheavy);
    background: var(--link-hover);
  }

  label:not(:has(:checked)):hover {
    background-color: var(--main-surface-background);
  }

  input {
    grid-area: 1 / 1 / 2 / 2;

    appearance: none;
    display: none;
  }

  .inner {
    height: 100%;
    position: relative;
    border-radius: 6px;
    overflow-y: scroll;

    background: var(--border-sharp);
    outline: 1px solid var(--border-xheavy);
  }

  .inner > fieldset {
    position: absolute;
    inset: 0;
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
    height: fit-content;
  }
</style>
