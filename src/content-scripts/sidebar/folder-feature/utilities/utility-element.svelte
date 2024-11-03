<script>
  import FolderLogic from "./folder-logic.svelte";
  import SearchLogic from "./search-logic.svelte";
  let isExpanded = false;
</script>

<div class="utility">
  <SearchLogic bind:isExpanded on:input />
  <FolderLogic bind:isExpanded />
</div>

<style>
  div {
    display: flex;
    justify-content: space-between;
    gap: 0.375rem;
    height: 2.75rem;
    padding-block: 0.25rem;
    margin-block-end: 0.25rem;
  }
</style>
