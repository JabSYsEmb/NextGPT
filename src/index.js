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
 * General notes about the development and why the project is written this way:
 * - `requestIdleCallback` is used in multiple places to avoid blocking the main thread and ensure the stack is empty.
 * - Fetch is proxied twice: once in `static/scripts/proxy/proxy.js` and again in `src/utils/index.js`
 *   because extensions have two different contexts: content scripts and the main window, which is restricted from access.
 */

window.addEventListener("load", contentScript);

async function contentScript() {
  // --- Skip script execution for paths starting with /auth, /api, or /backend-api --- //
  // --- These endpoints are used for authentication and backend operations --- //
  if (["/auth", "/api", "/backend-api"].some((endpoint) => window.location.pathname.startsWith(endpoint))) return;

  /**
   * array of `actions` needs to be invoked immediately after eventlisteners are registered.
   */
  const { actions, dispatches } = addEventListeners();

  for (const action of actions) await invoke(action);

  // Log a message in the console for logged-out users.
  if (window.loggedOut) return console.info("[NextGPT]: Please login to activate the extension!");

  // TODO:
  // add a notification to the user to login
  // Display this message once every three months to avoid annoying the user.
  // Store the timestamp of the last display in localStorage.

  // set userId in window object
  window.userId = await fetch("/backend-api/me")
    .then((res) => res.json())
    .then(({ id }) => id)
    .catch(() => console.error("[nextGPT]: something went wrong, please try again! or contact our support team."));

  if (!window.userId || !window.userId.startsWith("user-")) return;

  await setupScript(window.userId);

  /**
   * dispatches keep them at the end of the script
   */
  dispatches.forEach((dispatch) => eventDispatchers(dispatch));

  // checks weather the user has landed on the home page from the omnibox by
  // checking for the search query in the URL, if so it submit the search query
  // to chatgpt and initiate a new conversation.
  if (window.location.pathname === "/") {
    const searchQuery = new URL(window.location).searchParams.get("search");

    if (searchQuery) {
      await advanceQuerySelector("#prompt-textarea").then((el) => {
        el.innerHTML = `<p>${searchQuery}</p>`;
      });

      await advanceQuerySelector('[data-testid="send-button"]:not(:disabled)').then((btn) => btn.click());
    }
  }

  // update last 10 conversations and last 5 archived conversations
  // important for user who is logging into their chatgpt account from mutliple devices.
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
