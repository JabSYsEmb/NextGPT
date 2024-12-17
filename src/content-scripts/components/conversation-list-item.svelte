<script>
  export let title;
</script>

<li>
  {title}
</li>

<style>
  li {
    position: relative;
    min-width: 0;
    border-radius: 0.25rem;
    overflow: hidden;
    border: 1px solid var(--border-medium);
    background-color: var(--sidebar-surface-primary);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding-inline-start: 0.25rem;

    height: 2.75rem;
    width: 100%;
    cursor: pointer;
  }

  li:is(:hover, .active) {
    background-color: var(--sidebar-surface-secondary);
  }
</style>
