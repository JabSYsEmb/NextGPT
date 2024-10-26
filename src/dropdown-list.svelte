<script>
  import { slide } from "svelte/transition";

  export let title = "Dropdown List";
  export let items = [];

  function toggle() {
    isOpen = !isOpen;
  }
  let isOpen = false;
</script>

<div>
  <button on:click={toggle}>{title}</button>
  {#if isOpen}
    <ul transition:slide={{ duration: 1000 }}>
      {#each items as { text, id } (id)}
        <li>{text} - {id}</li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  div {
    position: fixed;
    z-index: 100;
    width: 100px;
    height: 100px;
    background-color: cadetblue;
    right: 10vi;
    bottom: 30vh;
    border-radius: 8px;
  }

  button {
    outline: 1px solid black;
  }

  ul {
    display: flex;
    flex-direction: column;
  }

  li {
    display: block;
    padding: 8px;
    background-color: red;
    border-bottom: 1px solid black;
  }
</style>
