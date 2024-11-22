import { fetchFiles, fetchGizmos, iterator } from "./api";
import { deleteDB, openDB } from "idb";
import { appendToLocalStorage, getPropertyFromLocalStorage, updatePropertyInLocalStorage } from "./utils";
import { progressIndicator } from "../stores";

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
  const gizmos = await fetchGizmos();

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

      const folderStore = db.createObjectStore("folders", { keyPath: "id" });
      folderStore.createIndex("name", "name", { unique: false });
      folderStore.createIndex("create_time", "create_time", { unique: false });

      const gizmoStore = db.createObjectStore("gizmos", { keyPath: "id" });
      gizmos.forEach((gizmo) => gizmoStore.add(gizmo));
    },
  })
    .then((db) => {
      appendToLocalStorage(name, { db: { stores: Array.from(db.objectStoreNames) } });
      return db;
    })
    .catch((e) => e);
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

  if (!data.length) return Promise.resolve(true);

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
 * @param {Array<any>} data  // Array<DataItemType>
 */
export async function updateItemByIdDB(name, store, { id, ...update }) {
  if (!name || !id) return Promise.reject(new Error("Missing parameters for the updateItemByIdDB function"));
  if (!getPropertyFromLocalStorage(name, "db")) return Promise.reject(new Error("db not found!"));

  const isSynced = await openDB(name)
    .then((db) => {
      const tx = db.transaction(store, "readwrite");
      const storeObj = tx.objectStore(store);
      const item = storeObj.get(id);
      if (!item) throw new Error();

      storeObj.put({ ...item, ...update });
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

export async function convertDBIntoObject(name) {
  if (!name) return Promise.reject(new Error("name can't be undefined or null!"));
  if (!getPropertyFromLocalStorage(name, "db")) return Promise.reject(new Error("db not found!"));

  return await openDB(name)
    .then(async (db) => {
      const tx = db.transaction(db.objectStoreNames, "readonly");
      const data = {};
      for (let storeName of tx.objectStoreNames) {
        try {
          /**@type {IDBObjectStore} */
          const store = tx.objectStore(storeName);
          data[storeName] = await store.getAll().then((items) => items);
        } catch (_) {
          data[storeName] = [];
        }
      }
      return data;
    })
    .catch(() => {});
}

export function getIndexedDBProxied() {
  // get put/delete/add methods from IDBObjectStore proxied
  // each time are being called
  const proxyIDBObjectStore = {
    apply(target, thisArg, args) {
      const targetStoreName = thisArg.name;
      switch (target.name) {
        case "put":
          console.log("put", args, targetStoreName);
          break;
        case "delete":
          console.log("delete", args, targetStoreName);
          break;
        case "add":
          console.log("add", args, targetStoreName);
          break;
        default:
          console.log(target.name, "no action assosiated with this method!");
      }
      return Reflect.apply(target, thisArg, args);
    },
  };

  IDBObjectStore.prototype.put = new Proxy(IDBObjectStore.prototype.put, proxyIDBObjectStore);
  IDBObjectStore.prototype.delete = new Proxy(IDBObjectStore.prototype.delete, proxyIDBObjectStore);
  IDBObjectStore.prototype.add = new Proxy(IDBObjectStore.prototype.add, proxyIDBObjectStore);
}
