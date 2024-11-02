<script>
  import FolderLogic from "./folder-logic.svelte";
  import SearchLogic from "./search-logic.svelte";
</script>

<div class="utility">
  <SearchLogic />
  <FolderLogic />
</div>

<style>
  div {
    display: flex;
    justify-content: stretch;
    gap: 0.375rem;
    padding-block: 0.25rem;
    height: 2.75rem;
    margin-block-end: 0.25rem;
  }
</style>
