let draggedItem = null;

/**
 * @param {HTMLElement} node
 * @param {any} data
 */
export function draggable(node, data) {
  let state = data;

  node.draggable = true;

  function handle_dragstart(e) {
    if (!e.dataTransfer) return;
    draggedItem = node;
    node.style.opacity = "0";
  }

  function handle_dragend() {
    node.style.opacity = "1";
    draggedItem = null;
  }

  function handle_dragover() {
    node.classList.contains("drag-over") || node.classList.add("drag-over");
  }

  function handle_dragleave() {
    node.classList.contains("drag-over") && node.classList.remove("drag-over");
  }

  function handle_drop() {
    node.classList.contains("drag-over") && node.classList.remove("drag-over");

    if (draggedItem) node.insertAdjacentElement("beforebegin", draggedItem);
  }

  node.addEventListener("dragend", handle_dragend);
  node.addEventListener("dragstart", handle_dragstart);
  node.addEventListener("dragover", handle_dragover);
  node.addEventListener("dragleave", handle_dragleave);

  node.addEventListener("drop", handle_drop);

  return {
    update(data) {
      state = data;
    },

    destroy() {
      node.removeEventListener("dragstart", handle_dragstart);
      node.removeEventListener("dragend", handle_dragend);
    },
  };
}
