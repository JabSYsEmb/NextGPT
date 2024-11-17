import { advanceQuerySelector } from "../../../utils";

/**
 * @param {HTMLElement} node
 */
export default async (node) => {
  const searchBtn = await advanceQuerySelector('[aria-label="⌘ K"]', { timeout: 1500 }, node);
  if (!searchBtn) return console.error(`[error]: search feature not found!`);

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
          cleanup();
          break;
      }
    };

    const handleClick = (/**@type {MouseEvent}*/ e) => {
      if (!e.composedPath().some((el) => el.localName === "li")) return;
      dispatch();
      cleanup();
    };

    const dispatch = () => {
      const query = dialogEl.querySelector("input").value;
      document.dispatchEvent(new CustomEvent("onSearchNavigate", { detail: { query } }));
    };

    const cleanup = () => {
      dialogEl.removeEventListener("click", handleClick);
      dialogEl.removeEventListener("keydown", handleKeyDown);
    };

    dialogEl.querySelector("button").addEventListener("click", cleanup);
    dialogEl.addEventListener("click", handleClick);
    dialogEl.addEventListener("keydown", handleKeyDown);
  });
};
