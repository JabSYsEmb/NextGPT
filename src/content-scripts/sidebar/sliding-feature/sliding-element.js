import {
  advanceQuerySelector,
  appendToLocalStorage,
  sidebarOpeningBtnSelector,
  getPropertyFromLocalStorage,
  updatePropertyInLocalStorage,
  sidebarClosingBtnSelector,
  getCookie,
  setCookie,
} from "../../../utils";

import SlidingNode from "./sliding-element.svelte";


/**
 *
 * @param {HTMLElement} element
 */
export async function slidingFeatureScript(element) {
  const isNavStateOpen = getCookie('oai-nav-state') === "1";
  const uniqueId = window.userId.slice(-8);
  const nodeId = `element-${uniqueId}`;

  if (!isNavStateOpen) {
    const openBtn = await advanceQuerySelector(sidebarOpeningBtnSelector);

    openBtn.addEventListener(
      "click",
      () => {
        setCookie('oai-nav-state', 1)
        slidingFeatureScript(element);
      },
      { once: true, capture: true }
    );

    return;
  } else {
    const closeBtn = await advanceQuerySelector(sidebarClosingBtnSelector, { target: element });

    closeBtn.addEventListener("click", async () => {
      if (!slider) return;

      slider.classList.toggle('hidden');
      const onOpenListener = await advanceQuerySelector(sidebarOpeningBtnSelector);
      onOpenListener.addEventListener("click", () => {
        slider.classList.remove('hidden');
      }, { once: true });

    });
  }


  let sidebarWidth = getPropertyFromLocalStorage(window.userId, "sidebar")?.width;

  if (!sidebarWidth) {
    appendToLocalStorage(window.userId, { sidebar: { width: "260px" } });
    sidebarWidth = "260px";
  }

  if (element.firstElementChild) {
    // first child is set to have 260px width by default
    // so we need to override it
    element.firstElementChild.classList.add("w-full");
    // element.firstElementChild.setAttribute('id', nodeId);
  }

  element.setAttribute("id", nodeId);
  element.classList.remove('overflow-hidden', 'border-e');
  element.classList.add('relative');

  addStyleNode(
    `#${nodeId}:before{content:" ";inset-inline-end:0;background-color:var(--border-light);z-index:99;width:2px;height:100vh;transition:width .2s ease-in-out;position:absolute;top:0;transform:translate(50%)}
     #${nodeId}.resizing:before{background-color:var(--sliding-border-color);width:4px}
     #${nodeId}:has(button#slider:hover):before{background-color:var(--sliding-border-color);width:4px}
     #${nodeId}:not(.resizing){transition:width .5s ease-in}`
  );

  document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);


  function onResizing({ clientX }) {
    const { left } = element.getBoundingClientRect();
    const newWidth = clientX - left;

    if (newWidth >= 450 || newWidth <= 200) return;

    document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);

    updatePropertyInLocalStorage(window.userId, "sidebar", { width: `${newWidth}px` });
  }


  new SlidingNode({
    target: element,
    props: {
      element,
      onResizing,
    },
  });
}

/**
 * Adds a new <style> node to the DOM with the specified CSS rules.
 * @param {string} cssText - The CSS rules to add to the document.
 * @param className
 * @param target
 */
function addStyleNode(cssText, className = "", target = document.head) {
  if (!cssText) return;
  if (className) styleNode.classList.add(className);

  const styleNode = document.createElement("style");
  styleNode.textContent = cssText;
  const addedStyleNode = target.appendChild(styleNode);
  addedStyleNode.destroy = () => target.removeChild(addedStyleNode);
  addedStyleNode.restore = () => target.appendChild(addedStyleNode);
  return addedStyleNode;
}
