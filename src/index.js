import { deleteDB } from "idb";
import addEventListeners from "./content-scripts/addEventListeners";
import eventDispatchers from "./content-scripts/eventDispatchers";
import { invoke, iterator, initDB } from "./utils";

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

  await initDB().then(async (db) => {
    var tx = db.transaction(["conversations", "archive"], "readonly");

    const convos = await tx
      .objectStore("conversations")
      .getAll()
      .then((res) => res);

    const archive = await tx
      .objectStore("archive")
      .getAll()
      .then((res) => res);

    console.log({ convos, archive });
  });
})();
