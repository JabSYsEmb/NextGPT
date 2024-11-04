import { openDB } from "idb";
import { getPropertyFromLocalStorage, initDB } from "../../utils";
import Setup from "./setup.svelte";

export async function setupScript(userId, target = document.body) {
  if (getPropertyFromLocalStorage(userId, "db")) return openDB(userId);

  const setupIndicator = new Setup({
    target,
  });

  // init indexedDB
  return await initDB(userId)
    .then((db) => {
      return db;
    })
    .catch(() => {
      alert("opps! something went wrong, please try again");
      return undefined;
    })
    .finally(() => {
      setupIndicator.$destroy();
    });
}
