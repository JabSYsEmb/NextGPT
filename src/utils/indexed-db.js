import { fetchFiles, iterator } from "./api";
import { deleteDB, openDB } from "idb";
import {
  appendToLocalStorage,
  dispatchValidateDB,
  getPropertyFromLocalStorage,
  updatePropertyInLocalStorage,
} from "./utils";
import { progressIndicator } from "../stores";

// get put/delete/add methods from IDBObjectStore proxied to dispatchValidateDB
// each time are being called
const proxyIDBObjectStore = {
  apply(target, thisArg, args) {
    dispatchValidateDB();
    return Reflect.apply(target, thisArg, args);
  },
};

IDBObjectStore.prototype.put = new Proxy(IDBObjectStore.prototype.put, proxyIDBObjectStore);
IDBObjectStore.prototype.delete = new Proxy(IDBObjectStore.prototype.delete, proxyIDBObjectStore);
IDBObjectStore.prototype.add = new Proxy(IDBObjectStore.prototype.add, proxyIDBObjectStore);

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
    for await (const items of iter) {
      data.push(...items);
      progressIndicator.update((n) => n + items.length);
    }
    return data;
  });

  const convos = await Promise.all(convo_fetcher).then((res) => res.flat());
  const files = await fetchFiles();

  return await openDB(name, version, {
    upgrade(db) {
      const convoStore = db.createObjectStore("conversations", { keyPath: "id" });
      convoStore.createIndex("id", "id", { unique: true });
      convoStore.createIndex("gizmo_id", "gizmo_id", { unique: false });
      convoStore.createIndex("update_time", "update_time", { unique: false });
      convos.forEach((convo) => convoStore.add(convo));

      const fileStore = db.createObjectStore("files", { keyPath: "id" });
      fileStore.createIndex("id", "id", { unique: true });
      fileStore.createIndex("name", "name", { unique: false });
      fileStore.createIndex("ready_time", "ready_time", { unique: false });
      files.forEach((file) => fileStore.add(file));
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
  return true;
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

/**
 *
 * @param {string} name
 * @param {string} store
 * @param {Partial<import('../types.d').DataItemType>} update
 * @returns
 */
export async function bulkUpdateDB(name, store, update = {}) {
  if (!name) return Promise.reject(new Error("name can't be undefined or null!"));
  if (!getPropertyFromLocalStorage(name, "db")) return Promise.reject(new Error("db not found!"));

  return await openDB(name)
    .then(async (db) => {
      const tx = db.transaction(store, "readwrite");
      /**@type {IDBObjectStore} */
      const storedb = tx.objectStore(store);
      await storedb.getAll().then((items) => {
        for (const item of items) storedb.put({ ...item, ...update });
      });

      return true;
    })
    .catch(() => false);
}
