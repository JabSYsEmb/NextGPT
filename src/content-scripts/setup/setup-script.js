import { openDB } from "idb";

import { getPropertyFromLocalStorage, initDB } from "../../utils";
import { progressIndicator } from "../../stores";
import Setup from "./setup.svelte";

export async function setupScript(userId, target = document.body) {
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
  const db = await initDB(userId).catch((e) => {
    console.log("opps! something went wrong while setting your db, please try again\n", e);
    return e;
  });

  if (db instanceof Error) {
    setupIndicator.$destroy();
    return Promise.reject(db);
  }

  // artifical delay, it is important to not register a macrotask as it won't
  // block the main thread, we need to be assure that the main thread is blocked
  // to prevent further scripts to injected.
  await new Promise((res) => setTimeout(res, 1000));

  setupIndicator.$destroy();
  return db;
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
