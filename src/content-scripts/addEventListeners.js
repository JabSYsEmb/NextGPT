import { sidebarScript, addSaveAsBtnScript } from "./index";
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
    const style = document.head.querySelector(".added-style-node");
    if (style) style.parentElement.removeChild(style);
    setTimeout(sidebarScript, e.detail?.timeout ?? 0);
  });

  // -- inject addSaveAsBtnScript onAddSaveAsBtn event -- //
  dispatches.push("onAddSaveAsBtn");
  document.addEventListener("onAddSaveAsBtn", (e) => {
    setTimeout(addSaveAsBtnScript, e.detail?.timeout ?? 0);
  });

  // --- auth action --- //
  actions.push("auth");
  document.addEventListener("onAuth", (/**@type {CustomEvent<import('../types.d').OnAuthEvent>}*/ e) => {
    auth.set(e.detail.auth);
  });

  // --- proxy action --- //
  actions.push("proxy");

  let isJustNewConvoCreated;
  document.addEventListener("onNavigate", (/**@type {CustomEvent<import('../types.d').OnNavigateEvent>}*/ e) => {
    // as this event is triggered a script which injects elment in the DOM,
    // we need to delay the injectiong until the navigation is finished
    // 330ms can be enough but needs to be tested for slow internet connections

    if (isJustNewConvoCreated) {
      isJustNewConvoCreated = false;
      document.dispatchEvent(new CustomEvent("onAddSaveAsBtn"));
    }

    const customEventTimeout = { detail: { timeout: 330 } };
    if (
      e.detail.navigateToLocation.startsWith("/gpts") ||
      e.detail.navigateToLocation.startsWith("/g/") ||
      e.detail.currentLocation.startsWith("/gpts") ||
      e.detail.currentLocation.startsWith("/g/")
    ) {
      document.dispatchEvent(new CustomEvent("injectSidebarScript", customEventTimeout));
    }
  });

  document.addEventListener("onPOST", (e) => {
    if (!e.detail) return;

    const body = JSON.parse(e.detail.body);

    isJustNewConvoCreated = window.location.pathname === "/" && body.action === "next";
  });

  document.addEventListener("onPATCH", (e) => {
    if (!e.detail) return;
    const { url, ok, options } = e.detail;
    if (!ok) return console.error("request failed");

    /**@type {import('../types.d').PatchBodyRequest} */
    const patchBody = JSON.parse(options.body);
    if (patchBody.title) console.log(`${url} has been renamed to ${patchBody.title}`);
    if (patchBody.is_archived === true) console.log(`${url} has been archived`);

    // if(!patchBody.is_archived) will be true if patchBody.is_archived is undefined or null
    // but we need to check only if patchBody.is_archived is false as it means the url has been restored from the archive
    if (patchBody.is_archived === false) console.log(`${url} has been restored from the archive`);

    // if(!patchBody.is_visible) will be true if patchBody.is_visible is undefined or null
    // therefore we can't use it to check if the url has been removed completely
    if (patchBody.is_visible === false) console.log(`${url} has been removed completely`);
  });

  document.addEventListener("onGET", (e) => {
    if (!e.detail) return;

    switch (e.detail.action) {
      case "save-as-btn":
        document.dispatchEvent(new CustomEvent("onAddSaveAsBtn"));
        break;
    }
  });

  return { actions, dispatches };
};

// the saveAsBtn must be injected in four scenarios:
// 1. when the page is loaded by entering the url directly in omnibox (initial call of addSaveAsBtnScript)
// 2. when the page is loaded by navigating on clicking on the convo link (onGet event triggered for convo pages)
// 3. when navigating using the back/forward button of the browser (onGet event triggered for convo pages)
// 4. when the user initilize a new conversation (onPost event triggered for new conversation)
