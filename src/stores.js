import { writable } from "svelte/store";
import { getConvoIdFromURL } from "./utils";

export const url = (function (init = getConvoIdFromURL(window.location.href)) {
  const { subscribe, set } = writable(init);

  return {
    subscribe,
    set: (value) => set(getConvoIdFromURL(value)),
  };
})();
