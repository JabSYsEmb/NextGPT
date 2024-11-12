<script>
  import { openDB } from "idb";
  import { useSortable } from "./actions";

  import UtilityElement from "./utilities/utility-element.svelte";
  import ConvoAnchorElement from "./convo-anchor-element.svelte";
  import FolderElement from "./folder-element.svelte";
  import ArchiveFolderElement from "./archive-folder-element.svelte";

  /**@type {{inbox: Array<any> , folders: {name: string, id: number, items: Array<any>}[] }, archive: undefined | {}}*/
  let data = {
    inbox: [],
    folders: [],
  };

  let toBeFiltered = [];

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

    toBeFiltered = temp;

    temp = Object.groupBy(temp, ({ is_archived }) => (is_archived ? "archive" : "rest"));
    temp["rest"] = Object.groupBy(temp["rest"], ({ gizmo_id }) => gizmo_id ?? "no-gizmo");

    data["archive"] = {
      name: "archive",
      id: Date.now(),
      items: temp["archive"] ?? [], // in case no archive needs to be empty array
    };

    const { ["no-gizmo"]: a, ...rest } = temp["rest"];
    data["inbox"] = a;

    const gpts = Object.entries(rest).map(([k, items]) => {
      if (!(k in gizmos)) return;

      const [k_gizmo] = gizmos[k];
      return {
        name: k_gizmo.display.name,
        profile: k_gizmo.display.profile_picture_url,
        items,
        id: items[0]?.update_time ?? Date.now(),
      };
    });

    data["folders"] = gpts;
  }

  let filtered;
  function onInputSearchQuery(/**@type {MouseEvent}*/ e) {
    if (e.target.value === "") {
      filtered = undefined;
      return;
    }
    filtered = toBeFiltered.filter((item) => item.title.toLowerCase().includes(e.target.value.toLowerCase()));
  }

  // onMount:
  document.addEventListener("preload", updateList);
  window.addEventListener("validate-db", updateList);
</script>

<div id="folder-view">
  <UtilityElement on:input={onInputSearchQuery} />
  <ul use:useSortable>
    {#if filtered}
      {#each filtered as filter (filter.id)}
        <ConvoAnchorElement item={filter} />
      {/each}
    {:else}
      {#each data["folders"] as folder (folder.items)}
        <FolderElement {...folder} />
      {/each}
      {#each data["inbox"] as item (item.id)}
        <ConvoAnchorElement {item} />
      {/each}
      {#if data?.archive}
        <ArchiveFolderElement {...data?.archive} />
      {/if}
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
