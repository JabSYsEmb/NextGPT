<script>
  import { openDB } from "idb";

  const db = openDB(window.userId).then(async (db) => {
    const tx = db.transaction(["archive", "conversations"], "readonly");

    return {
      conversations: await tx.objectStore("conversations").getAll(),
      archive: await tx.objectStore("archive").getAll(),
    };
  });

  function useAnchorBehavior(/**@type {HTMLElement}*/ node, { id }) {
    function handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      window.history.pushState({}, "", `/c/${id}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }

    node.addEventListener("click", handleClick);

    return () => {
      node.removeEventListener("click", handleClick);
    };
  }
</script>

<div id="folder-view">
  {#await db}
    <span>loading...</span>
  {:then { archive, conversations }}
    {#each conversations as item (item.id)}
      <span use:useAnchorBehavior={item}>{item.title} - {new Date(item.create_time).toLocaleDateString()}</span>
    {/each}

    {#each archive as item (item.id)}
      <span class="archive" use:useAnchorBehavior={item}
        >{item.title} - {new Date(item.create_time).toLocaleDateString()}</span
      >
    {/each}
  {/await}
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

  span {
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

  span:hover {
    background-color: hsla(0, 0%, 100%, 0.5);
  }
</style>
