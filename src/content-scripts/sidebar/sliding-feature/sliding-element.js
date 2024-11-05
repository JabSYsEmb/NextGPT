import {
  sha256,
  advanceQuerySelector,
  appendToLocalStorage,
  sidebarOpeningBtnSelector,
  getPropertyFromLocalStorage,
  updatePropertyInLocalStorage,
} from "../../../utils";
import SlidingNode from "./sliding-element.svelte";

/**
 *
 * @param {HTMLElement} element
 */
export async function slidingFeatureScript(element) {
  const isCollapsed = JSON.parse(localStorage.getItem("UiState.isNavigationCollapsed.1")) || false;
  const uniqueId = window.userId.split("-").pop().slice(0, 8);
  const nodeId = `element-${uniqueId}`;

  if (isCollapsed) {
    const openBtn = await advanceQuerySelector(sidebarOpeningBtnSelector);

    openBtn.addEventListener(
      "click",
      () => {
        localStorage.setItem("UiState.isNavigationCollapsed.1", JSON.stringify(false));
        slidingFeatureScript(element);
      },
      { once: true }
    );

    return;
  } else {
    // TODO: overflow hidden must not be removed directly instead after the transition is ended
    const closeBtn = await advanceQuerySelector("button", {}, element);

    closeBtn.addEventListener("click", async () => {
      element.removeAttribute("id");
      element.classList.add("overflow-x-hidden");

      const onOpenListener = await advanceQuerySelector(sidebarOpeningBtnSelector);

      onOpenListener.addEventListener("click", () => {
        element.classList.remove("overflow-x-hidden");
        element.setAttribute("id", nodeId);
      });
    });
  }

  if (element.firstElementChild) {
    // first child is set to have 260px width by default
    // so we need to override it
    element.firstElementChild.classList.add("w-full");
  }

  let sidebarWidth = getPropertyFromLocalStorage(window.userId, "sidebar")?.width;
  if (!sidebarWidth) {
    appendToLocalStorage(window.userId, { sidebar: { width: "260px" } });
    sidebarWidth = "260px";
  }

  addStyleNode(`
      #${nodeId}::before {
          width: 2px;
          height: 100vh;
          position: absolute;
          content: " ";
          inset-inline-end: 0;
          top: 0;
          transform: translateX(50%);
          background-color: var(--border-light);
          transition: width 200ms ease-in-out;
          z-index: 11;
        }
  
      #${nodeId}:has(button#slider:hover)::before,
      #${nodeId}.resizing::before {
        width: 4px;
      }
  
      #${nodeId}:not(.resizing) {
        transition: width 0.5s ease-in;
      }
    `);

  const styleNode = addStyleNode(
    `
      #${nodeId} {
        width: ${sidebarWidth} !important;
      }
    `,
    "added-style-element"
  );

  element.classList.remove("overflow-x-hidden", "z-[1]");
  element.classList.add("relative", "flex-0");

  element.setAttribute("id", nodeId);

  function onResizing({ clientX }) {
    if (styleNode.parentElement) styleNode.destroy();

    const { left } = element.getBoundingClientRect();
    const newWidth = clientX - left;

    if (newWidth >= 450 || newWidth <= 200) return;

    element.style.width = `${newWidth}px`;

    updatePropertyInLocalStorage(window.userId, "sidebar", { width: `${newWidth}px` });
  }

  function onResized() {
    styleNode.innerHTML = `#${nodeId}{width:${
      getPropertyFromLocalStorage(window.userId, "sidebar").width
    } !important;}`;
    styleNode.restore();
  }

  new SlidingNode({
    target: element,
    props: {
      element,
      onResizing,
      onResized,
    },
  });
}

/**
 * Adds a new <style> node to the DOM with the specified CSS rules.
 * @param {string} cssText - The CSS rules to add to the document.
 */
function addStyleNode(cssText, className = "", target = document.head) {
  const styleNode = document.createElement("style");
  if (className) styleNode.classList.add(className);
  styleNode.textContent = cssText;
  const addedStyleNode = target.appendChild(styleNode);
  addedStyleNode.destroy = () => target.removeChild(addedStyleNode);
  addedStyleNode.restore = () => target.appendChild(addedStyleNode);
  return addedStyleNode;
}
