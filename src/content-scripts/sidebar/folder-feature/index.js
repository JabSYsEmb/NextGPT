import { advanceQuerySelector } from "../../../utils";
import FolderContainer from "./folder-container.svelte";
import Controller from "./controller.svelte";

/**
 *
 * @param {HTMLElement} node
 * @returns
 */
export default async function folderFeatureScript(node) {
  const conversationBox = await advanceQuerySelector(
    ".flex.flex-col.gap-2.pb-2.text-token-text-primary.text-sm.mt-5",
    {},
    node
  );

  if (!conversationBox) return console.error("[error]: conversation-box not found!");

  let convo_view_element = await advanceQuerySelector("div", { timeout: 1000 }, conversationBox).catch(() => false);

  if (!convo_view_element) {
    convo_view_element = document.createElement("div");
    conversationBox.insertAdjacentElement("afterbegin", convo_view_element);
  }

  const folder_view_element = document.createElement("div");
  folder_view_element.classList.add("hidden");

  const target = document.createElement("div");

  conversationBox.insertAdjacentElement("afterbegin", target);
  conversationBox.insertAdjacentElement("beforeend", folder_view_element);

  new FolderContainer({ target: folder_view_element });

  const controllerEl = new Controller({
    target,
    props: {
      convo_view_element,
      folder_view_element,
    },
  });

  // dispatch from controller on the click on folder button
  controllerEl.$on("focusSearchInput", () => {
    const searchInputEl = document.querySelector("nav .search-input");
    if (!searchInputEl) return;
    searchInputEl.focus();
  });
}
