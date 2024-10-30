import addEventListeners from "./content-scripts/addEventListeners";
import eventDispatchers from "./content-scripts/eventDispatchers";
import { invoke, initDB } from "./utils";
import { user } from "./stores";

(async () => {
  /**
   * array of `actions` and `disptches` needs to be invoked
   */
  const { actions, dispatches } = addEventListeners();

  for (const action of actions) await invoke(action);

  /**
   * dispatches events keep them at the end of the script
   */
  dispatches.forEach((dispatch) => eventDispatchers(dispatch));

  /**@type {import('./types.d').UserType} */
  const userId = await fetch("/backend-api/me")
    .then((res) => res.json())
    .then((userObj) => {
      user.set(userObj);
      return userObj.id;
    });

  await initDB(userId);
})();
