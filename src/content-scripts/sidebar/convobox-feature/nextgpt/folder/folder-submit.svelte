<script>
  import { getUUID } from "../../../../../utils";

  export let nfolder;
  export let conversations = [];

  let curr_date = new Date().toISOString();

  const items = (nfolder.items ?? []).map((id) => conversations.find((c) => c.id === id)).filter(Boolean);

  const id = getUUID();

  let tmp = { ...nfolder, id, items, create_date: curr_date, update_date: curr_date };
</script>

<div class="inner">
  <pre>
  {JSON.stringify(tmp, null, 2)}
  </pre>
</div>

<style>
  .inner {
    height: 100%;
    position: relative;
    border-radius: 6px;
    overflow-y: scroll;

    border: 1px solid var(--border-xheavy);
    background-color: black;
  }

  pre {
    position: absolute;
    inset: 0;
    outline: 1px solid var(--border-light);
    padding: 1rem;
  }
</style>
