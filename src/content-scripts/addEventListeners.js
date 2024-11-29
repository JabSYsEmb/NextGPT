import { openDB } from "idb";
import { url } from "../stores";
import { bulkUpdateDB, deleteItemByIdDB, fetchGizmos, getConvoIdFromURL, syncDB } from "../utils";
import { sidebarScript, saveAsBtnScript } from "./index";
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

  // -- inject saveAsBtnScript injectSaveAsBtnScript event -- //
  dispatches.push("injectSaveAsBtnScript");
  document.addEventListener("injectSaveAsBtnScript", (e) => {
    setTimeout(saveAsBtnScript, e.detail?.timeout ?? 0);
  });

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
        new CustomEvent("onNavigate", {
          detail: {
            navigateToLocation,
            currentLocation: get(url),
          },
        })
      );
    };

    return;
  });

  // --- proxy action --- //
  actions.push("proxy");
  document.addEventListener("onNavigate", async (/**@type {CustomEvent<import('../types.d').OnNavigateEvent>}*/ e) => {
    // as this event is triggered a script which injects elment in the DOM,
    // we need to delay the injectiong until the navigation is finished
    // 330ms can be enough but needs to be tested for slow internet connections
    const customEventTimeout = { detail: { timeout: 330 } };
    // when a user runs from main global to the content-script scope.

    const currentLocation = new URL(window.origin + e.detail.currentLocation);
    const navigateToLocation = new URL(window.origin + e.detail.navigateToLocation);

    url.set(navigateToLocation.pathname);

    // no need for reinjecting this script if the user still in the same page..
    // chatgpt has some pages were the url gets appended with query params and hashtags but the page is still the same
    // therefore we need to check if the pathname is the same
    if (navigateToLocation.pathname === currentLocation.pathname) return;

    if (
      currentLocation.pathname.startsWith("/g") &&
      navigateToLocation.pathname.startsWith(currentLocation.pathname) &&
      getConvoIdFromURL(navigateToLocation.pathname)
    ) {
      return;
    }

    if (
      navigateToLocation.pathname.startsWith("/g") &&
      (currentLocation.pathname.startsWith("/c") || currentLocation.pathname === "/")
    ) {
      customEventTimeout.detail.timeout += 600;
      document.dispatchEvent(new CustomEvent("injectSidebarScript", customEventTimeout));
      return;
    }

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

    document.dispatchEvent(new CustomEvent("injectSaveAsBtnScript"));

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

    if (JSON.parse(options.body)?.is_visible === false)
      return deleteItemByIdDB(window.userId, "conversations", convoId);

    const item = await fetch(`/backend-api/conversation/${convoId}`)
      .then((res) => res.json())
      .then((res) => ({
        title: res.title,
        update_time: new Date(res.update_time * 1000).toISOString(),
        is_archived: res.is_archived,
      }))
      .catch(() => {});

    if (!item) return console.info(`failed to update ${convoId} inside IDB.`);

    await openDB(window.userId).then(async (db) => {
      const tx = db.transaction("conversations", "readwrite");
      const store = tx.objectStore("conversations");
      const xitem = await store.get(convoId);
      store.put({ ...xitem, ...item });
    });
  });

  document.addEventListener("onGizmoPOST", async () => {
    const gizmos = await fetchGizmos();
    await syncDB(window.userId, "gizmos", gizmos);
  });

  document.addEventListener("onGET", async (e) => {
    if (!e.detail) return;

    for (const action of e.detail.actions) {
      switch (action) {
        case "save-as-btn-script":
          document.dispatchEvent(new CustomEvent("injectSaveAsBtnScript"));
          break;

        default:
          console.warn(`warning: the '${action}' action was not handled!`);
      }
    }
  });

  return { actions, dispatches };
};

// dispatched from 'proxy.js'
const search_history = new Map();
document.addEventListener("onSearch", (e) => {
  const { query, items } = e.detail;
  if (!query || !Object.keys(items).length) return;

  if (search_history.has(query)) {
    const tmp = search_history.get(query);
    search_history.set(query, Object.assign(tmp, items));
    return;
  }
  search_history.set(query, items);
});

// dispatched from 'sidebar/search-feature/injex.js'
document.addEventListener("onSearchNavigate", (e) => {
  const { query } = e.detail;
  if (!query || !search_history.has(query)) return;

  const t = search_history.get(query);

  document.addEventListener(
    "onNavigate",
    (ev) => {
      const convoId = getConvoIdFromURL(ev.detail.navigateToLocation);
      const item = t[convoId][0];
      const { kind, message_id: messageId } = item.payload;
      switch (kind) {
        case "title":
          return;
        case "message":
          document.dispatchEvent(new CustomEvent("onMessageLocate", { detail: { messageId } }));
          break;
        default:
          console.log(`${kind} isn't handled!`, item, convoId, messageId);
      }
    },
    { once: true }
  );
});

// the saveAsBtn must be injected in four scenarios:
// 1. when the page is loaded by entering the url directly in omnibox (initial call of addSaveAsBtnScript)
// 2. when the page is loaded by navigating on clicking on the convo link (onGet event triggered for convo pages)
// 3. when navigating using the back/forward button of the browser (onGet event triggered for convo pages)
// 4. when the user initilize a new conversation (onPost event triggered for new conversation)
