<script>
  import { SearchIcon } from "../../../../icons";
</script>

<div>
  <input class="search-input" placeholder="search" name="search" />
  <button class="search-btn"><SearchIcon /></button>
</div>

<style>
  div {
    flex-grow: 1;
    display: grid;
    overflow: hidden;
    position: relative;
    grid-template-rows: 1fr;
    border-radius: 0.375rem;
    grid-template-columns: 1fr;
    outline: 1px solid var(--border-medium);
    transition: all 250ms ease-in-out;
  }

  div:is(:focus-visible, :focus-within, :focus) {
    outline: 2px solid var(--text-error);
    outline-offset: -0.5px;
  }

  button {
    position: absolute;
    overflow: hidden;
    left: 5px;
    top: 50%;
    transition: all 150ms ease-in-out;
    transform: translateY(-50%);
    outline: 1px solid var(--border-medium);
    height: 1.75rem;
    width: 1.75rem;
    border-radius: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div:is(:focus-visible, :focus-within, :focus) button {
    background-color: var(--text-error);
    outline: none;
    font-weight: 900;
    color: white;
  }

  input {
    min-width: 0;
    flex-grow: 1;
    height: 100%;
    padding-inline: 2.5rem;
    min-width: 0;
    grid-column: 1 / 2;
    background-color: rgb(210 210 210 / var(--tw-bg-opacity));
  }

  :global(.dark) input {
    background-color: var(--main-surface-secondary);
  }

  input::placeholder {
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input:is(:focus-visible, :focus-within, :focus) {
    outline: none;
  }

  input:focus-within::placeholder {
    visibility: hidden;
  }
</style>
