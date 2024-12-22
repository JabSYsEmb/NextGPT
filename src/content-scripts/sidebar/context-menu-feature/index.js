import SaveAsBtnNavbarAnchor from "./save-as-btn-navbar-anchor.svelte";
import { downloadOptions } from "../../../utils";

/**
 *
 * @param {HTMLElement} element */
export default async function contextMenuFeatureScript(element) {
  if (element.classList.contains("context-menu-feature-instrumented")) return;
  element.classList.add("context-menu-feature-instrumented");

  element.addEventListener("pointerdown", (/** @type {PointerEvent} */ e) => {
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
      radixMenu.classList.add("no-padding-bottom");

      new SaveAsBtnNavbarAnchor({
        target: radixMenu,
        props: {
          options: downloadOptions.filter((option) => option.available),
          convoId,
          class: radixMenu.querySelector("div[role='menuitem']").className,
        },
      });
    });
  });
}
