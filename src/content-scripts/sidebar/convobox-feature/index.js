import { advanceQuerySelector, convertDBIntoObject } from "../../../utils";

import ConvoboxSwitchElement from "./convobox-switch-element.svelte";
import NextgptConvoBoxElement from "./nextgpt-convobox-element.svelte";

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

    const convoboxHeaderEl = document.createElement("div");
    convoboxHeaderEl.setAttribute("id", "folder-header");
    convoboxHeaderEl.classList.add("w-full", "mb-auto");

    const nextGPTConvoBox = document.createElement("div");
    nextGPTConvoBox.classList.add("nextgpt-div", "hidden");
    sidebarEl.insertAdjacentElement("afterbegin", convoboxHeaderEl);
    sidebarEl.insertAdjacentElement("beforeend", nextGPTConvoBox);

    const dbObject = await convertDBIntoObject(window.userId);

    new NextgptConvoBoxElement({
      target: nextGPTConvoBox,
      props: { ...dbObject },
    });

    new ConvoboxSwitchElement({
      target: convoboxHeaderEl,
      props: {
        nextGPTConvoBox,
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
  node.classList.add("border", "h-auto");
}
