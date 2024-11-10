<script>
  import { openDB } from "idb";
  import { useSortable } from "./actions";

  import UtilityElement from "./utilities/utility-element.svelte";
  import ConvoAnchorElement from "./convo-anchor-element.svelte";
  import FolderElement from "./folder-element.svelte";

  /**@type {{inbox: Array<any> , folders: {name: string, id: number, items: Array<any>}[] }}*/
  let data = {
    inbox: [],
    folders: [],
  };

  async function updateList() {
    data = {
      folders: [],
      inbox: [],
    };

    const gizmos = await openDB(window.userId)
      .then((db) => db.transaction("gizmos", "readonly").objectStore("gizmos").getAll())
      .then((gizmoz) => Object.groupBy(gizmoz, ({ id }) => id));

    let temp = await openDB(window.userId)
      .then((db) => db.transaction("conversations", "readonly").objectStore("conversations").getAll())
      .then((index) => index.sort((a, b) => new Date(b.update_time).getTime() - new Date(a.update_time).getTime()));

    temp = Object.groupBy(temp, ({ is_archived }) => (is_archived ? "archive" : "rest"));
    temp["rest"] = Object.groupBy(temp["rest"], ({ gizmo_id }) => gizmo_id ?? "no-gizmo");

    data["folders"].push({
      name: "archive",
      id: Date.now(),
      items: temp["archive"] ?? [], // in case no archive needs to be empty array
    });

    const { ["no-gizmo"]: a, ...rest } = temp["rest"];
    data["inbox"] = a;

    Object.entries(rest).forEach(([k, items]) => {
      if (!(k in gizmos)) return;

      const [k_gizmo] = gizmos[k];
      data["folders"].push({
        name: k_gizmo.display.name,
        profile: k_gizmo.display.profile_picture_url,
        items,
        id: Date.now(),
      });
    });
  }

  let filtered = [];
  function onInputSearchQuery(/**@type {MouseEvent}*/ e) {
    filtered = data["inbox"].filter((item) => item.title.toLowerCase().includes(e.target.value.toLowerCase()));
  }

  // onMount:
  document.addEventListener("preload", updateList);
  window.addEventListener("validate-db", updateList);
</script>

<div id="folder-view">
  <UtilityElement on:input={onInputSearchQuery} />
  <ul use:useSortable>
    {#each data["folders"] as folder (folder.items)}
      <FolderElement {...folder} />
    {/each}

    {#if filtered.length}
      {#each filtered as filter (filter.id)}
        <ConvoAnchorElement item={filter} />
      {/each}
    {:else}
      {#each data["inbox"] as item (item.id)}
        <ConvoAnchorElement {item} />
      {/each}
    {/if}
  </ul>
</div>

<style>
  #folder-view {
    display: flex;
    width: 100%;
    min-height: 50dvh;
    flex-direction: column;
    justify-content: flex-start;
    padding-inline: 1px;
  }

  ul {
    display: flex;
    flex-direction: column;

    width: 100%;
  }
</style>
