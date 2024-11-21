import { advanceQuerySelector } from "../../../utils";

/**
 *
 * @param {HTMLElement} node
 * @returns
 */
export default async function folderFeatureScript(node) {
  const conversationBox = await advanceQuerySelector(".flex.flex-col.gap-2.pb-2.text-token-text-primary.text-sm.mt-5", {
    target: node,
  });

  if (!conversationBox) return console.error("[error]: conversation-box not found!");
  const svgEl = conversationBox.querySelector("svg");

  if (svgEl) {
    const observer = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) {
        requestIdleCallback(initiateFolderFeatureScript);
        observer.disconnect();
        return;
      }
    });
    observer.observe(svgEl);
  }

  async function initiateFolderFeatureScript() {
    conversationBox.insertAdjacentHTML(
      "afterbegin",
      "<div class='border border-token-border-light mb-auto w-full py-1' style='margin-bottom: auto;'>good for you</div>"
    );
    if (conversationBox.classList.contains("empty:hidden")) {
      handleEmptyConversationBox(conversationBox);
    } else {
      handleNotEmptyConversationBox(conversationBox);
    }
  }
}

/**
 *
 * @param {HTMLElement} conversationBox
 */
function handleEmptyConversationBox(conversationBox) {
  conversationBox.classList.remove("empty:hidden");
  conversationBox.classList.add("bg-token-main-surface-secondary");
}

/**
 *
 * @param {HTMLElement} conversationBox
 */
async function handleNotEmptyConversationBox(conversationBox) {
  // const convo_view_element = await advanceQuerySelector("div:has([data-discover])", {}, conversationBox);
  await advanceQuerySelector("ol li[data-testid]", { target: conversationBox }).then(console.log, console.error);
  conversationBox.classList.add("border");
  conversationBox.classList.add("border-token-border-light");
}
