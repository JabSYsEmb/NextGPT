import { advanceQuerySelector } from "../../../utils";

/**
 * @param {HTMLElement} node
 */
export default async (node) => {
  // $="K" handles cases for all operating systems and browsers
  const searchBtn = await advanceQuerySelector('[aria-label$="K"]', {
    timeout: 1500,
    target: node,
  }).catch(() => undefined);

  if (!searchBtn || searchBtn.classList.contains("search-feature-instrumented")) return;

  searchBtn.classList.add("search-feature-instrumented");

  // memory-leak: the listeners are not cleaned up
  // the click on close button must cleanup the listeners
  // and click outside also must cleanup liteners
  // the escape keydown must also cleanup listeners
  searchBtn.addEventListener("click", async () => {
    const dialogEl = await advanceQuerySelector('div[role="dialog"]');

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Enter":
          dispatch();
          break;
      }
    };

    const handleClick = (/**@type {MouseEvent}*/ e) => {
      if (!e.composedPath().some((el) => el.localName === "li")) return;
      dispatch();
    };

    const dispatch = () => {
      const query = dialogEl.querySelector("input").value;
      document.dispatchEvent(new CustomEvent("onSearchNavigate", { detail: { query } }));
      cleanup();
    };

    const cleanup = () => {
      dialogEl.removeEventListener("click", handleClick);
      dialogEl.removeEventListener("keydown", handleKeyDown);
    };

    dialogEl.addEventListener("click", handleClick);
    dialogEl.addEventListener("keydown", handleKeyDown);

    dialogEl.querySelector("button").addEventListener("click", cleanup);
  });

  document.addEventListener("onMessageLocate", async (e) => {
    await advanceQuerySelector(`[data-message-id="${e.detail.messageId}"]`, { target: "main" })
      .then((el) => {
        if (isElementAlreadyInViewport(el)) return;
        requestIdleCallback(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
      })
      .catch(() => {});
  });
};

function isElementAlreadyInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
