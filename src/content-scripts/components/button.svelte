<script>
  let className = "";
  export { className as class };

  export let bg;
  export let color;
  export let width;
  export let height;

  export let borderWidth;
  export let borderColor;
  export let borderStyle;

  export let borderRadius;

  export let outlineColor;
  export let outlineStyle;
  export let outlineWidth;

  export let hoverBg;
  export let hoverColor;
</script>

<button
  class={className}
  style:--bg={bg}
  style:--btn-width={width}
  style:--btn-height={height}
  style:--color={color}
  style:--outline-color={outlineColor}
  style:--outline-width={outlineWidth}
  style:--outline-style={outlineStyle}
  style:--border-width={borderWidth}
  style:--border-style={borderStyle}
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
    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: 500;

    min-width: fit-content;
    min-height: fit-content;

    width: var(--btn-width);
    height: var(--btn-height);

    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color, var(--text-secondary));
    padding-inline: 0.5rem;

    outline: var(--outline-color, var(--border-light)) var(--outline-style, solid) var(--outline-width, 0px);

    border-radius: var(--border-radius, 0);

    border-width: var(--border-width, 0px);
    border-style: var(--border-style, solid);
    border-color: var(--border-color, var(--border-light));
    transition: all 100ms ease-in;
    background-color: var(--bg, var(--border-medium));
  }

  button:is(.inaction, :hover) {
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
