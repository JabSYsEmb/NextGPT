import { sidebarScript } from "./index";
import { auth } from "../stores";

export default () => {
  document.addEventListener("injectSidebarScript", (e) => {
    setTimeout(sidebarScript, e.detail?.timeout || 0);
  });

  // on getting auth obj
  document.addEventListener("onAuth", (/**@type {CustomEvent<{auth: Object}>}*/ e) => auth.set(e.detail.auth));

  // on navigation
  document.addEventListener(
    "onNavigate",
    (/**@type {CustomEvent<{ navigateToLocation: string, currentLocation: string }>}*/ e) => {
      if (
        e.detail.navigateToLocation.startsWith("/gpts") ||
        e.detail.currentLocation.startsWith("/gpts") ||
        e.detail.navigateToLocation.startsWith("/g/") ||
        e.detail.currentLocation.startsWith("/g/")
      ) {
        document.dispatchEvent(new CustomEvent("injectSidebarScript", { detail: { timeout: 1000 } }));
      }
    }
  );

  // on fetch event
  document.addEventListener("onFetch", (/**@type {CustomEvent}*/ e) => {
    console.log("onFetch", e.detail);
  });
};
