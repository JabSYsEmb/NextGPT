import { setupScript } from "./content-scripts";
import addEventListeners from "./content-scripts/addEventListeners";
import eventDispatchers from "./content-scripts/eventDispatchers";
import {
  invoke,
  syncDB,
  fetchFiles,
  getIndexedDBProxied,
  advanceQuerySelector,
  getFetchAPIProxied,
  getFileAssetURI,
} from "./utils";

/**
 * general notes, about the development and why the project written the way it's:
 * - requestIdleCallback, is used in multiple places to avoid blocking the main thread and assue the stack is empty
 * - I got fetch proxied twice once in static/scripts/proxy/proxy.js and the other in src/utils/index.js
 *   because extensions has two different contexts, content scripts and one the main window which restricted to access
 */

window.addEventListener("load", contentScript);

async function contentScript() {
  // --- don't execute this scripts for pathnames starts with /auth/ or /api/ or /backend-api/ --- //
  // --- these endpoints are used for authentication and logoutting --- //
  if (["/auth", "/api", "/backend-api"].some((endpoint) => window.location.pathname.startsWith(endpoint))) return;

  /**
   * array of `actions` and `disptches` needs to be invoked
   */
  const { actions, dispatches } = addEventListeners();

  for (const action of actions) await invoke(action);

  // console.log extension off for logged-out users in console (for now);
  // make it shows once each three months otherwise the user will get annoyed
  // store it in localstorage...
  if (window.loggedOut) return console.info("[NextGPT]: Please login to activate the extension!");

  // set userId in window object
  window.userId = await fetch("/backend-api/me")
    .then((res) => res.json())
    .then(({ id }) => id)
    .catch(() => console.error("[nextGPT]: something went wrong, please try again! or contact our support team."));

  if (!window.userId || !window.userId.startsWith("user-")) return;

  await setupScript(window.userId);

  /**
   * dispatches events keep them at the end of the script
   */
  dispatches.forEach((dispatch) => eventDispatchers(dispatch));

  if (window.location.pathname === "/") {
    const searchQuery = new URL(window.location).searchParams.get("search");

    if (searchQuery) {
      await advanceQuerySelector("#prompt-textarea").then((el) => {
        el.innerHTML = `<p>${searchQuery}</p>`;
      });

      await advanceQuerySelector('[data-testid="send-button"]:not(:disabled)').then((btn) => btn.click());
    }
  }

  const convo_data = await fetch("/backend-api/conversations?limit=10")
    .then((res) => res.json())
    .then(({ items }) => items);

  const archived_convo_data = await fetch("/backend-api/conversations?is_archived=true&limit=5")
    .then((res) => res.json())
    .then(({ items }) => items);

  await syncDB(window.userId, "conversations", [...convo_data, ...archived_convo_data]);

  await fetchFiles().then(async (data) => {
    await syncDB(window.userId, "files", data);
  });

  getIndexedDBProxied();
  getFetchAPIProxied();

  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    const { action, ...rest } = request;

    (async () => {
      switch (action) {
        case "get-asset":
          const url = new URL(rest.asset);
          await getFileAssetURI(url).then((url) => sendResponse(url));
          break;
        default:
          console.info(`[nextGPT]: the action '${action}' was not handled!`);
      }
    })();

    return true;
  });
}
