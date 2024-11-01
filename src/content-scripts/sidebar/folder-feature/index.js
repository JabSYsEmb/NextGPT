import { advanceQuerySelector } from "../../../utils";
import FolderContainer from "./folder-container.svelte";
import Controller from "./controller.svelte";
import { openDB } from "idb";

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
  const convo_view_element = await advanceQuerySelector("div", {}, conversationBox);
  const folder_view_element = document.createElement("div");
  folder_view_element.classList.add("hidden");

  console.log(convo_view_element, folder_view_element);

  const target = document.createElement("div");

  conversationBox.insertAdjacentElement("afterbegin", target);
  conversationBox.insertAdjacentElement("beforeend", folder_view_element);

  new FolderContainer({ target: folder_view_element });

  new Controller({
    target,
    props: {
      convo_view_element,
      folder_view_element,
    },
  });
}
