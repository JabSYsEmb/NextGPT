import { advanceQuerySelector, downloadOptions, languageObj, invokeAction } from "./utils";
import { SaveAsBtnNavbarAnchor } from "./components";
import { auth } from "./stores";

invokeAction("auth", () =>
  document.addEventListener("onAuth", (/**@type {CustomEvent<{auth: Object}>}*/ e) => auth.set(e.detail.auth))
);

advanceQuerySelector("nav").then((el) => {
  el.addEventListener("pointerdown", (/** @type {PointerEvent} */ e) => {
    let { clientX, clientY } = e;
    clientX ||= -e.layerX;
    clientY ||= -e.layerY;

    if (!clientX || !clientY) return;

    const anchor = document.elementsFromPoint(clientX, clientY).find((element) => element.tagName === "A");

    if (!anchor) return;

    setTimeout(() => {
      const radixMenu = document.body.querySelector("[data-radix-menu-content]");
      if (!radixMenu) return;

      new SaveAsBtnNavbarAnchor({
        target: radixMenu,
        props: {
          options: downloadOptions,
          langObj: languageObj,
          url: anchor.href,
          class: radixMenu.querySelector("div").className,
        },
      });
    });
  });
});
