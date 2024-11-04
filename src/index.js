import { setupScript } from "./content-scripts";
import addEventListeners from "./content-scripts/addEventListeners";
import eventDispatchers from "./content-scripts/eventDispatchers";
import { invoke, syncDB, getFilesObj } from "./utils";

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
    .then(({ id }) => id);

  const db = await setupScript(window.userId);

  if (!db) return console.log("something went wrong, please try again! or contact our support team.");

  /**
   * dispatches events keep them at the end of the script
   */
  dispatches.forEach((dispatch) => eventDispatchers(dispatch));

  const convo_data = await fetch("/backend-api/conversations?limit=10")
    .then((res) => res.json())
    .then(({ items }) => items);
  const archived_convo_data = await fetch("/backend-api/conversations?is_archived=true&limit=10")
    .then((res) => res.json())
    .then(({ items }) => items);

  await syncDB(window.userId, "conversations", [...convo_data, ...archived_convo_data]);

  await getFilesObj().then((data) => {
    syncDB(window.userId, "files", data);
  });
})();
