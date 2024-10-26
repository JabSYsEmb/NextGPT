import { advanceQuerySelector } from "./utils";
import { SaveAsBtnNavbarAnchor } from "./components";
import { downloadOptions, languageObj } from "./utils";
import { invoke } from "./utils/chrome-runtime";
import { auth } from "./store";

document.addEventListener("onAuth", (/**@type {CustomEvent} */ e) => auth.set(e.detail.auth));

invoke("auth");

advanceQuerySelector("nav").then((el) => {
  let dbugger = false;
  el.addEventListener("pointerdown", (/** @type {PointerEvent}*/ e) => {
    let { clientX, clientY, layerX, layerY } = e;

    if (!e.isTrusted && !dbugger) {
      console.info(
        "SGV5IHRoZXJlLCBuaWNlIHRvIHNlZSB5b3UgaGVyZSEgZmVlbCBmcmVlIHRvIGNvbnRhY3QgbWUgb24gYGNhYmJhci5zZXJpZkBob3RtYWlsLmNvbWAgaWYgYW55IGhlbHAgbmVlZGVkLg"
      );
      dbugger = true;
    }

    clientX ||= layerX;
    clientY ||= layerY;

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
        },
      });
    });
  });
});
