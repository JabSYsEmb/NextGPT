import addEventListeners from "./content-scripts/addEventListeners";
import eventDispatchers from "./content-scripts/eventDispatchers";
import { invoke, initDB } from "./utils";

(async () => {
  /**
   * array of `actions` and `disptches` needs to be invoked
   */
  const { actions, dispatches } = addEventListeners();

  for (const action of actions) await invoke(action);

  // console.log extension off for logged-out users in console (for now);
  // make it shows once each three months otherwise the user will get annoyed
  // store it in localstorage...
  if (window.loggedOut) return console.log("you must be logged in to use this extension");
  window.userId = await fetch("/backend-api/me")
    .then((res) => res.json())
    .then(({ id }) => id);

  /**
   * dispatches events keep them at the end of the script
   */
  dispatches.forEach((dispatch) => eventDispatchers(dispatch));

  await initDB(window.userId);
})();
