import SaveAsBtnNavbarAnchor from "./save-as-btn-navbar-anchor.svelte";
import { downloadOptions } from "../../../utils";

/**
 *
 * @param {HTMLElement} element */
export default async function contextMenuFeatureScript(element) {
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

      new SaveAsBtnNavbarAnchor({
        target: radixMenu,
        props: {
          options: downloadOptions.filter((option) => option.available),
          convoId,
          class: radixMenu.querySelector("div").className,
        },
      });
    });
  });
}
