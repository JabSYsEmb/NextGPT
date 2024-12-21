import { get } from "svelte/store";

import { advanceQuerySelector, convertDBIntoObject } from "../../../utils";
import { initializeDbStore } from "./store";
import { DirectoryTree } from "./utils/directory-tree";

import SwitchElement from "./switch-element.svelte";
import NextgptContainer from "./nextgpt/nextgpt-container.svelte";

/**
 *
 * @param {HTMLElement} node
 * @returns
 */
export default async function convoboxFeatureScript(node) {
  if (document.querySelector("#folder-header")) return;

  const sidebarEl = await advanceQuerySelector(".flex.flex-col.gap-2.pb-2.text-token-text-primary.text-sm.mt-5", {
    target: node,
  });

  if (!sidebarEl) return console.error("[error]: conversation-box not found!");
  const svgEl = sidebarEl.querySelector("svg");

  if (svgEl) {
    const observer = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) {
        requestIdleCallback(convoboxFeatureLogic);
        observer.disconnect();
        return;
      }
    });
    observer.observe(svgEl);
  } else {
    convoboxFeatureLogic();
  }

  async function convoboxFeatureLogic() {
    if (sidebarEl.classList.contains("empty:hidden")) {
      handleEmptyConversationBox(sidebarEl);
    }

    const switchContainer = document.createElement("div");
    switchContainer.setAttribute("id", "folder-header");
    switchContainer.classList.add("w-full");

    const nextgptContainer = document.createElement("div");
    nextgptContainer.classList.add("nextgpt-div", "hidden", "w-full", "mb-auto");
    sidebarEl.insertAdjacentElement("afterbegin", switchContainer);
    sidebarEl.insertAdjacentElement("beforeend", nextgptContainer);

    const dbObjectSvelteStore = await convertDBIntoObject(window.userId).then(DirectoryTree);

    new NextgptContainer({
      target: nextgptContainer,
      props: { dbObjectSvelteStore },
    });

    new SwitchElement({
      target: switchContainer,
      props: {
        nextgptContainer,
      },
    });
  }
}

/**
 *
 * @param {HTMLElement} node
 */
function handleEmptyConversationBox(node) {
  node.classList.remove("empty:hidden");
  node.classList.add("h-auto");
}
