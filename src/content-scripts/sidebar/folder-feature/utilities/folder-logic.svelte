<script>
  import { FolderIcon } from "../../../../icons";

  let expanded = false;
  function useExpandAction(/**@type {HTMLElement} */ node) {
    function clickHander() {
      expanded = !expanded;
    }

    node.addEventListener("click", clickHander);

    return () => {
      node.removeEventListener("click", clickHander);
    };
  }
</script>

<div class:expanded use:useExpandAction>
  <FolderIcon />
  <span>&leftarrow;</span>
</div>

<style>
  div {
    position: relative;

    width: 2rem;
    height: 100%;
    overflow: hidden;

    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    justify-items: center;

    padding-inline: 0.25rem;

    cursor: pointer;
    border-radius: 0.25rem;
    outline: 1px solid var(--border-medium);
    transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    width: 2rem;
  }

  div:not(.expanded):hover {
    width: 4rem;
    grid-template-columns: 1fr 1fr;
  }

  div:not(.expanded):hover span {
    display: block;
  }

  span {
    display: none;
  }

  .expanded {
    width: 90%;
  }
</style>
