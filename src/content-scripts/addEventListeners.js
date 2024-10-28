import { sidebarScript } from "./index";
import { auth } from "../stores";

/**
 * @returns {{actions: string[], dispatches: string[]}} returns object contains `actions` to be invoked by the background service-worker and `dispatches` to be dispatched by the content-script.
 * @description add required eventlisteners on the document object and returns an requierd actions to be invoked.
 */
export default () => {
  const actions = [];
  const dispatches = [];

  // --- injectSidebarScript dispatch --- //
  dispatches.push("injectSidebarScript");
  document.addEventListener("injectSidebarScript", (e) => {
    setTimeout(sidebarScript, e.detail?.timeout || 0);
  });

  // --- auth action --- //
  actions.push("auth");
  document.addEventListener("onAuth", (/**@type {CustomEvent<{auth: Object}>}*/ e) => auth.set(e.detail.auth));

  // --- proxy action --- //
  actions.push("proxy");
  document.addEventListener(
    "onNavigate",
    (/**@type {CustomEvent<{ navigateToLocation: string, currentLocation: string }>}*/ e) => {
      if (
        e.detail.navigateToLocation.startsWith("/gpts") ||
        e.detail.navigateToLocation.startsWith("/g/") ||
        e.detail.currentLocation.startsWith("/gpts") ||
        e.detail.currentLocation.startsWith("/g/")
      ) {
        document.dispatchEvent(new CustomEvent("injectSidebarScript", { detail: { timeout: 500 } }));
      }
    }
  );

  document.addEventListener("onFetch", (/**@type {CustomEvent}*/ e) => {
    console.log("onFetch", e.detail);
  });

  return { actions, dispatches };
};
