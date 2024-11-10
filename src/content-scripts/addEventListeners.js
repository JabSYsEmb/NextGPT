import { openDB } from "idb";
import { url } from "../stores";
import { bulkUpdateDB, fetchGizmos, getConvoIdFromURL, syncDB } from "../utils";
import { sidebarScript, addSaveAsBtnScript, archiveBtnScript } from "./index";
import { get } from "svelte/store";

/**
 * @returns {{actions: string[], dispatches: string[]}} returns object contains `actions` to be invoked by the background service-worker and `dispatches` to be dispatched by the content-script.
 * @description add required eventlisteners on the document object and returns an requierd actions to be invoked.
 */
export default () => {
  const actions = [];
  const dispatches = [];

  // --- injectidebarScript dispatch --- //
  dispatches.push("injectSidebarScript");
  document.addEventListener("injectSidebarScript", (e) => {
    const style = document.head.querySelector(".added-style-element");
    if (style) style.parentElement.removeChild(style);
    setTimeout(sidebarScript, e.detail?.timeout ?? 0);
  });

  // -- inject addSaveAsBtnScript onAddSaveAsBtn event -- //
  dispatches.push("onAddSaveAsBtn");
  document.addEventListener("onAddSaveAsBtn", (e) => {
    setTimeout(addSaveAsBtnScript, e.detail?.timeout ?? 0);
  });

  // -- invoked automatically when the user visits a archived conversations -- //
  // -- for further details, see proxy.js GET method handler and onGET eventlistener -- //
  document.addEventListener("injectArchiveBtnScript", () => setTimeout(archiveBtnScript, 0));

  // --- auth action --- //
  actions.push("auth");
  document.addEventListener("onAuth", (/**@type {CustomEvent<import('../types.d').OnAuthEvent>}*/ e) => {
    if (!e.detail.auth) return (window.loggedOut = true);

    window.fetch = new Proxy(window.fetch, {
      apply(target, thisArg, args) {
        try {
          new URL(args[0]);
        } catch {
          args[0] = window.location.origin + args[0];
        }

        args[1] = Object.assign(e.detail.auth, args[1] || {});

        return Reflect.apply(target, thisArg, args);
      },
    });

    // messy code but nah...
    // we have the similar behavior from
    window.onpopstate = function (e) {
      const navigateToLocation = e.target.location.pathname;
      document.dispatchEvent(
        new CustomEvent("onNavigate", { detail: { navigateToLocation, currentLocation: get(url) } })
      );
      document.dispatchEvent(new CustomEvent("onURLChange", { detail: { url: navigateToLocation } }));
    };

    return;
  });

  // --- proxy action --- //
  actions.push("proxy");
  document.addEventListener("onURLChange", (e) => {
    url.set(e.detail.url);
  }); // set the url store on url change

  document.addEventListener("onNavigate", async (/**@type {CustomEvent<import('../types.d').OnNavigateEvent>}*/ e) => {
    // as this event is triggered a script which injects elment in the DOM,
    // we need to delay the injectiong until the navigation is finished
    // 330ms can be enough but needs to be tested for slow internet connections
    const customEventTimeout = { detail: { timeout: 330 } };

    const currentLocation = new URL(window.origin + e.detail.currentLocation);
    const navigateToLocation = new URL(window.origin + e.detail.navigateToLocation);

    // no need for reinjecting this script if the user still in the same page..
    // chatgpt has some pages were the url gets appended with query params and hashtags but the page is still the same
    // therefore we need to check if the pathname is the same
    if (navigateToLocation.pathname === currentLocation.pathname) return;

    if (navigateToLocation.pathname.startsWith("/g") || currentLocation.pathname.startsWith("/g")) {
      document.dispatchEvent(new CustomEvent("injectSidebarScript", customEventTimeout));
    }
  });

  // this function called whenever the user send a POST request on /backend-api/lat/r which happens to be sent
  // in the following scenarios:
  // at the end of each repsonse
  // at naming a new conversation
  // ... to be continued to investigate.
  document.addEventListener("onPOST", async () => {
    const data = await fetch("/backend-api/conversations?limit=1")
      .then((res) => res.json())
      .then(({ items }) => items);

    await syncDB(window.userId, "conversations", data);

    document.querySelector("#save-as-btn") || document.dispatchEvent(new CustomEvent("onAddSaveAsBtn"));

    return;
  });

  document.addEventListener("onPATCH", async (e) => {
    if (!e.detail) return;

    const { url, ok, options } = e.detail;
    if (!ok) return console.error("request failed");

    // handle bulk archive
    if (url === "https://chatgpt.com/backend-api/conversations") {
      await bulkUpdateDB(window.userId, "conversations", JSON.parse(options.body));
      return;
    }

    // get indexed db ready
    const convoId = getConvoIdFromURL(url);
    const { store, item } = await openDB(window.userId).then(async (db) => {
      const tx = db.transaction("conversations", "readwrite");
      const store = tx.objectStore("conversations");
      const item = await store.get(convoId);
      return {
        store,
        item,
      };
    });

    // handle convo name changing
    /**@type {import('../types.d').PatchBodyRequest} */
    const patchBody = JSON.parse(options.body);
    if (patchBody.title) store.put({ ...item, title: patchBody.title });

    // handle convo archving
    if (patchBody.is_archived !== null && patchBody.is_archived !== undefined) {
      store.put({ ...item, is_archived: patchBody.is_archived });
    }

    // if(!patchBody.is_visible) will be true if patchBody.is_visible is undefined or null
    // therefore we can't use it to check if the url has been removed completely
    if (patchBody.is_visible === false) store.delete(convoId);
  });

  document.addEventListener("onGizmoPOST", async () => {
    const gizmos = await fetchGizmos();
    console.log(gizmos);
    await syncDB(window.userId, "gizmos", gizmos);
  });

  document.addEventListener("onGET", async (e) => {
    if (!e.detail) return;

    for (const action of e.detail.actions) {
      switch (action) {
        case "save-as-btn-script":
          document.dispatchEvent(new CustomEvent("onAddSaveAsBtn"));
          break;
        case "archive-btn-script":
          document.dispatchEvent(new CustomEvent("injectArchiveBtnScript"));
          break;

        default:
          console.warn(`warning: the '${action}' action was not handled!`);
      }
    }
  });

  return { actions, dispatches };
};

// the saveAsBtn must be injected in four scenarios:
// 1. when the page is loaded by entering the url directly in omnibox (initial call of addSaveAsBtnScript)
// 2. when the page is loaded by navigating on clicking on the convo link (onGet event triggered for convo pages)
// 3. when navigating using the back/forward button of the browser (onGet event triggered for convo pages)
// 4. when the user initilize a new conversation (onPost event triggered for new conversation)
