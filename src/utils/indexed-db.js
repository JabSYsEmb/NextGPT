import { iterator } from "./api";
import { deleteDB, openDB } from "idb";
import { appendToLocalStorage, getPropertyFromLocalStorage, updatePropertyInLocalStorage } from "./utils";
/**
 * @typedef {import('../types.d').DataItemType} DataItemType
 */

/**
 *
 * @param {string} name
 * @param {{version: number}} options
 * @returns {Promise<IDBDatabase>}
 */
export async function initDB(name, { version } = { version: 1 }) {
  if (!name || !version) return Promise.reject(new Error("name and version can't be undefined or null!"));
  if (getPropertyFromLocalStorage(name, "db")) return openDB(name, version);

  const convo_fetcher = [
    iterator("https://chatgpt.com/backend-api/conversations"),
    iterator("https://chatgpt.com/backend-api/conversations?is_archived=true"),
  ].map(async (iter) => {
    const data = [];
    for await (const items of iter) data.push(...items);
    return data;
  });

  const data = await Promise.all(convo_fetcher).then((res) => res.flat());

  return await openDB(name, version, {
    upgrade(db) {
      const store = db.createObjectStore("conversations", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("gizmo_id", "gizmo_id", { unique: false });
      store.createIndex("is_archived", "is_archived", { unique: false });
      data.forEach((item) => store.add(item));
    },
  }).then((db) => {
    appendToLocalStorage(name, { db: { stores: Array.from(db.objectStoreNames) } });
    return db;
  });
}

export async function deleteDdByName(name) {
  if (!name) return Promise.reject(new Error("name can't be undefined or null!"));
  if (!getPropertyFromLocalStorage(name, "db")) return Promise.reject(new Error("db not found!"));
  try {
    await deleteDB(name);
    updatePropertyInLocalStorage(name, "db", null);
  } catch (e) {
    return Promise.reject(e);
  }
  return;
}

/**
 *
 * @param {string} name
 * @param {Array<any>} data  // Array<DataItemType>
 */
export async function syncDB(name, store, data = []) {
  if (!name) return Promise.reject(new Error("name can't be undefined or null!"));
  if (!getPropertyFromLocalStorage(name, "db")) return Promise.reject(new Error("db not found!"));

  const isSynced = await openDB(name)
    .then((db) => {
      const tx = db.transaction(store, "readwrite");
      store = tx.objectStore(store);
      data.forEach((item) => store.put(item));
      return true;
    })
    .catch(() => false);

  return isSynced;
}
