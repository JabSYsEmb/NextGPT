import Sortable from "sortablejs";

export function useSortable(node) {
  const sortablejs = Sortable.create(node, {
    animation: 300,
    fallbackOnBody: true,
    swapThreshold: 0.65,
  });

  return {
    destroy() {
      sortablejs.destroy();
    },
  };
}
