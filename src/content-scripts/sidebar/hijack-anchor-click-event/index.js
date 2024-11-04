import { shallowTo } from "../../utils";

/**
 *
 * @param {HTMLElement} element
 */
export default async function hicakingAnchorClickScript(element) {
  element.addEventListener("click", (/** @type {PointerEvent} */ e) => {
    if (["svg", "path", "button"].some((n) => e.target.localName === n)) return;

    let { clientX, clientY } = e;
    clientX ||= -e.layerX;
    clientY ||= -e.layerY;

    if (!clientX || !clientY) return;

    /**@type {HTMLAnchorElement | undefined} */
    const anchor = document.elementsFromPoint(clientX, clientY).find((element) => element.tagName === "A");
    if (!anchor) return;

    const convoId = anchor.href.match(/[a-fA-F0-9-]{36}/)?.at(0);
    if (!convoId) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return shallowTo(`/c/${convoId}`);
  });
}
