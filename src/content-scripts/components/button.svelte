<script>
  let className = "";
  export { className as class };

  export let bg;
  export let color;
  export let width;
  export let height;
  export let borderColor;
  export let borderRadius;

  export let hoverBg;
  export let hoverColor;
</script>

<button
  class={className}
  style:--width={width}
  style:--height={height}
  style:--color={color}
  style:--border-color={borderColor}
  style:--border-radius={borderRadius}
  style:--hover-bg={hoverBg}
  style:--hover-color={hoverColor}
  {...$$restProps}
  on:click
>
  <slot />
</button>

<style>
  button {
    width: var(--width, auto);
    height: var(--height, auto);

    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color, var(--text-secondary));
    padding-inline: 0.5rem;
    border-radius: var(--border-radius, 6px);
    border-width: 2px;
    border-style: var(--border-style, solid);
    border-color: var(--border-color, var(--border-light));
    transition: all 100ms ease-in;
    background-color: var(--bg, var(--border-medium));
  }

  button:hover {
    color: var(--hover-color, var(--main-surface-primary));
    background-color: var(--hover-bg, var(--text-primary));
  }

  button.error {
    background-color: hsl(from var(--text-danger) h s calc(l - 10) / 0.5);
  }

  button.error:hover {
    color: var(--text-primary);
    background-color: var(--text-danger);
  }
</style>
