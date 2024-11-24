import { writable } from "svelte/store";

// first I need to invoke an event from put/delete functions of the indexeddb
// and pass the data to the store and handle actions needed to be considered
export function initializeDbStore(val = {}) {
  const { subscribe, update } = writable(val);

  /**@typedef {CustomEvent<{name: string, args: any[]}>} DBCustomEvent */

  document.addEventListener("dbUPDATE", (/**@type {DBCustomEvent}*/ e) => {
    update((curr) => {
      for (const arg of e.detail.args) {
        const idx = curr[e.detail.name].findIndex((item) => item.id === arg.id);
        if (idx === -1) {
          curr[e.detail.name].push(arg);
          continue;
        }
        curr[e.detail.name][idx] = Object.assign(curr[e.detail.name][idx], arg);
      }

      return curr;
    });
  });

  document.addEventListener("dbDELETE", (/**@type {DBCustomEvent}*/ e) => {
    update((curr) => {
      for (const arg of e.detail.args) {
        const idx = curr[e.detail.name].findIndex((item) => item.id === arg);
        if (idx === -1) continue;
        curr[e.detail.name].splice(idx, 1);
      }

      return curr;
    });
  });

  return {
    subscribe,
  };
}
