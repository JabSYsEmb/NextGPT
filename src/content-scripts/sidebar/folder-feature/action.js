/**
 *
 * @param {HTMLElement} node
 * @param {{fn: () => void}} param1
 */
export function usePreloadOnPointerDown(node, { fn } = { fn: () => console.log("empty function") }) {
  node.addEventListener("pointerdown", fn);

  return {
    destroy() {
      node.removeEventListener("pointerdown", fn);
    },
  };
}
