import { writable } from "svelte/store";

// first I need to invoke an event from put/delete functions of the indexeddb
// and pass the data to the store and handle actions needed to be considered
export function initializeDbStore(val = {}) {
  const dbStore = writable(val);

  document.addEventListener("dbPUT", (e) => {});
  document.addEventListener("dbDELETE", (e) => {});
  document.addEventListener("dbGET", (e) => {});

  return dbStore;
}
