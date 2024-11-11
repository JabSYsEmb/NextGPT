import { setupScript } from "./content-scripts";
import addEventListeners from "./content-scripts/addEventListeners";
import eventDispatchers from "./content-scripts/eventDispatchers";
import { invoke, syncDB, fetchFiles, getIndexedDBProxied, advanceQuerySelector } from "./utils";

(async () => {
  // --- don't execute this scripts for pathnames starts with /auth/ or /api/ --- //
  // --- these endpoints are used for authentication and logoutting --- //
  if (["/auth", "/api"].some((endpoint) => window.location.pathname.startsWith(endpoint))) return;

  /**
   * array of `actions` and `disptches` needs to be invoked
   */
  const { actions, dispatches } = addEventListeners();

  for (const action of actions) await invoke(action);

  // console.log extension off for logged-out users in console (for now);
  // make it shows once each three months otherwise the user will get annoyed
  // store it in localstorage...
  if (window.loggedOut) return console.log("you must be logged in to use this extension");

  // set userId in window object
  window.userId = await fetch("/backend-api/me")
    .then((res) => res.json())
    .then(({ id }) => id)
    .catch(() => console.error("[nextGPT]: something went wrong, please try again! or contact our support team."));

  if (!window.userId) return;

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

  await fetchFiles().then((data) => {
    syncDB(window.userId, "files", data);
  });

  getIndexedDBProxied();
})();
