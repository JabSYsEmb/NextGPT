import { iterator } from "./api";
import { openDB } from "idb";
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
  if (localStorage.getItem(name)) return openDB(name, version);

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
      for (const item of data.filter((it) => !it.is_archived))
        store.getKey(item.id).then((key) => !key && store.add(item));

      const archiveStore = db.createObjectStore("archive", { keyPath: "id" });
      archiveStore.createIndex("id", "id", { unique: true });
      archiveStore.createIndex("gizmo_id", "gizmo_id", { unique: false });
      for (const item of data.filter((it) => it.is_archived))
        archiveStore.getKey(item.id).then((key) => !key && archiveStore.add(item));
    },
  }).then((db) => {
    localStorage.setItem(name, version);
    return db;
  });
}
