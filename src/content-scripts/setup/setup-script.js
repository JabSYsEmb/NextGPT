import { openDB } from "idb";

import { deleteDdByName, getPropertyFromLocalStorage, initDB } from "../../utils";
import { progressIndicator } from "../../stores";
import Setup from "./setup.svelte";

export async function setupScript(userId, target = document.body) {
  if (getPropertyFromLocalStorage(userId, "db")) await deleteDdByName(userId);
  if (getPropertyFromLocalStorage(userId, "db")) return openDB(userId);

  const total = await getConversationsCount();

  const setupIndicator = new Setup({
    target,
    props: {
      total,
      progress: progressIndicator,
    },
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
    .finally(async () => {
      await new Promise((res) =>
        setTimeout(() => {
          setupIndicator.$destroy();
          res();
        }, 1000)
      );
    });
}

async function getConversationsCount() {
  const archived = await fetch("/backend-api/conversations?is_archived=true&limit=1")
    .then((res) => res.json())
    .then((res) => res.total)
    .catch((e) => {
      console.error(`[svelty]: ${e}`);
      return 0;
    });

  const normal = await fetch("/backend-api/conversations?limit=1")
    .then((res) => res.json())
    .then((res) => res.total)
    .catch((e) => {
      console.error(`[svelty]: ${e}`);
      return 0;
    });

  return normal + archived;
}
