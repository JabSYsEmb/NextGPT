// chrome-dev
import { downloadOptions, languageObj, sha256, advanceQuerySelector, sidebarOpeningBtnSelector } from "../../utils";
import { SaveAsBtnNavbarAnchor, SlidingNode } from "../../components";

/**
 *
 * @param {HTMLElement} node
 */
async function addSaveAsOption(node) {
  node.addEventListener("pointerdown", (/** @type {PointerEvent} */ e) => {
    let { clientX, clientY } = e;
    clientX ||= -e.layerX;
    clientY ||= -e.layerY;

    if (!clientX || !clientY) return;

    /**@type {HTMLAnchorElement | undefined} */
    const anchor = document.elementsFromPoint(clientX, clientY).find((element) => element.tagName === "A");

    if (!anchor) return;

    const convoId = anchor.href.match(/[a-fA-F0-9-]{36}/)?.at(0);

    if (!convoId) return;

    setTimeout(() => {
      const radixMenu = document.body.querySelector("[data-radix-menu-content]");
      if (!radixMenu) return;

      new SaveAsBtnNavbarAnchor({
        target: radixMenu,
        props: {
          options: downloadOptions.filter((option) => option.available),
          langObj: languageObj,
          convoId,
          class: radixMenu.querySelector("div").className,
        },
      });
    });
  });
}

/**
 *
 * @param {HTMLElement} node
 */
async function makeSlidable(node) {
  const isCollapsed = JSON.parse(localStorage.getItem("UiState.isNavigationCollapsed.1")) || false;
  const uniqueId = await sha256(node.className).then((identifier) => identifier.slice(0, 8));
  const localStorageKey = `oai/sidebar/${uniqueId}`;
  const nodeId = `node-${uniqueId}`;

  if (isCollapsed) {
    const openBtn = await advanceQuerySelector(sidebarOpeningBtnSelector);

    openBtn.addEventListener(
      "click",
      () => {
        localStorage.setItem("UiState.isNavigationCollapsed.1", JSON.stringify(false));
        makeSlidable(node);
      },
      { once: true }
    );

    return;
  } else {
    // TODO: overflow hidden must not be removed directly instead after the transition is ended
    const closeBtn = await advanceQuerySelector("button", {}, node);

    closeBtn.addEventListener("click", async () => {
      node.removeAttribute("id");
      node.classList.add("overflow-x-hidden");

      const onOpenListener = await advanceQuerySelector(sidebarOpeningBtnSelector);

      onOpenListener.addEventListener("click", () => {
        node.classList.remove("overflow-x-hidden");
        node.setAttribute("id", nodeId);
      });
    });
  }

  if (node.firstElementChild) {
    // first child is set to have 260px width by default
    // so we need to override it
    node.firstElementChild.classList.add("w-full");
  }

  let sidebarWidth = localStorage.getItem(localStorageKey);
  if (!sidebarWidth) {
    localStorage.setItem(localStorageKey, "260px");
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
        transition: all 200ms ease-in-out;
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

  const styleNode = addStyleNode(`
    #${nodeId} {
      width: ${sidebarWidth} !important;
    }
  `);

  node.classList.remove("overflow-x-hidden", "z-[1]");
  node.classList.add("relative", "flex-0");

  node.setAttribute("id", nodeId);

  function onResizing({ clientX }) {
    if (styleNode.parentElement) styleNode.destroy();

    const { left } = node.getBoundingClientRect();
    const newWidth = clientX - left;

    if (newWidth >= 450 || newWidth <= 200) return;

    node.style.width = `${newWidth}px`;

    localStorage.setItem(localStorageKey, node.style.width);
  }

  function onResized() {
    styleNode.innerHTML = `#${nodeId}{width:${localStorage.getItem(localStorageKey)} !important;}`;
    styleNode.restore();
  }

  new SlidingNode({
    target: node,
    props: {
      node,
      onResizing,
      onResized,
    },
  });
}

export default async (target) => {
  if (typeof target === "string") {
    try {
      target = document.querySelector(target);
    } catch (e) {
      return console.error(e);
    }
  }

  if (!target instanceof HTMLElement) return console.error(`[error]: Please provide a valid HTMLElment!`);

  makeSlidable(target);
  addSaveAsOption(target);
};

/**
 * Adds a new <style> node to the DOM with the specified CSS rules.
 * @param {string} cssText - The CSS rules to add to the document.
 */
function addStyleNode(cssText, target = document.head) {
  const styleNode = document.createElement("style");
  styleNode.textContent = cssText;
  const addedStyleNode = target.appendChild(styleNode);
  addedStyleNode.destroy = () => target.removeChild(addedStyleNode);
  addedStyleNode.restore = () => target.appendChild(addedStyleNode);
  return addedStyleNode;
}
