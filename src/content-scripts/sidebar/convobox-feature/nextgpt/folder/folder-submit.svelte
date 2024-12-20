<script>
  import { getUUID } from "../../../../../utils";

  export let nfolder;
  export let conversations = [];

  let curr_date = new Date().toISOString();

  const items = nfolder.items.map((id) => conversations.find((c) => c.id === id)).filter(Boolean);

  const id = getUUID();

  const obj = { id, ...nfolder, items, create_date: curr_date, update_date: curr_date };
</script>

<div>
  <pre>
  {JSON.stringify(obj, null, 2)}
  </pre>
</div>

<style>
  div {
    height: 400px;
    width: 100%;
    overflow-y: scroll;
  }

  pre {
    outline: 1px solid var(--border-light);
    padding: 1rem;
    background-color: black;
  }
</style>
