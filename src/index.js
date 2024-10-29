import addEventListeners from "./content-scripts/addEventListeners";
import eventDispatchers from "./content-scripts/eventDispatchers";
import { invoke, visitor, delay } from "./utils";

(async () => {
  /**
   * array of `actions` and `disptches` needs to be invoked
   */
  const { actions, dispatches } = addEventListeners();

  actions.forEach(invoke);

  /**
   * dispatches events keep them at the end of the script
   */
  dispatches.forEach((dispatch) => eventDispatchers(dispatch));

  await delay(1000);

  //   visitor("https://chatgpt.com/backend-api/conversations?limit=1&offset=40&order=updated", (d) => {});
})();
