import Sortable from "sortablejs";

export function useSortable(node) {
  const sortablejs = Sortable.create(node);

  return {
    destroy() {
      sortablejs.destroy();
    },
  };
}
