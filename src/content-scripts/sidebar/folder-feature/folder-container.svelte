<script>
  import { openDB } from "idb";

  let db = null;

  function onAnchorClichHandler(id) {
    return function handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      window.history.pushState({}, "", `/c/${id}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    };
  }

  document.addEventListener("preload", async () => {
    db = await openDB(window.userId).then((db) => {
      const tx = db.transaction("conversations", "readonly");
      return tx.objectStore("conversations").getAll();
    });
  });
</script>

<div id="folder-view">
  {#if db}
    <button on:click={() => (db = [])}>reset</button>
    {#each db.sort((a, b) => a.is_archived - b.is_archived) as { title, id, create_time, is_archived } (id)}
      <a class:archive={is_archived} href="/c/{id}" on:click={onAnchorClichHandler(id)}>
        {title} - {new Date(create_time).toLocaleDateString()}
      </a>
    {/each}
  {:else}
    <span>something went wrong</span>
  {/if}
</div>

<style>
  div {
    display: flex;
    width: 100%;
    min-height: 50dvh;
    background-color: cadetblue;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-inline: 2px;
  }

  a {
    cursor: pointer;
    min-width: 0;
    width: 100%;
    overflow: hidden;
    background-color: hsla(190, 80%, 70%, 0.5);
    margin-block: 0.125rem;

    display: flex;
    align-items: center;

    height: 2.5rem;
    border-radius: 0.25rem;
    margin-inline-start: 0.15rem;
    padding-inline: 0.5rem;
    outline: 1px solid var(--border-medium);
  }

  .archive {
    background-color: hsla(10, 80%, 70%, 0.5);
  }

  a:hover {
    background-color: hsla(0, 0%, 100%, 0.5);
  }
</style>
