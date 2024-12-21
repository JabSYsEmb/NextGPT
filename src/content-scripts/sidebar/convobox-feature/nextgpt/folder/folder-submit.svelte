<script>
  import { getUUID } from "../../../../../utils";
  import { FolderCard } from "../components";

  export let nfolder;
  export let conversations;

  const curr_date = new Date().toISOString();
  const id = getUUID();

  const children = conversations.filter(({ id }) => (nfolder.selected_items ?? []).includes(id));

  Object.assign(nfolder, {
    id,
    children: children.map((item) => ({ id: item.id, type: "convo" })),
    create_date: curr_date,
    update_date: curr_date,
  });
</script>

<div class="inner">
  <div class="content">
    <FolderCard folder={nfolder} bgcolor="red" {children} />
  </div>
</div>

<style>
  .inner {
    height: 100%;
    position: relative;
    border-radius: 6px;
    overflow-y: scroll;

    background: var(--border-sharp);
    border: 1px solid var(--border-xheavy);
  }

  .content {
    position: absolute;
    inset: 0;
    outline: 1px solid var(--border-light);
    padding-inline: 0.25rem;
  }
</style>
