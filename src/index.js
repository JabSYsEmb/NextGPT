import addEventListeners from "./content-scripts/addEventListeners";
import eventDispatchers from "./content-scripts/eventDispatchers";
import { invoke, visitor } from "./utils";

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

  visitor("https://chatgpt.com/backend-api/conversations?offset=40&order=updated", (d) => {
    console.log(d);
  });
})();
