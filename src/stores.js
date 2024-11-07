import { getConvoIdFromURL } from "./utils/utils";
import { writable } from "svelte/store";

export const url = (function (init = getConvoIdFromURL(window.location.href)) {
  const { subscribe, set } = writable(init);

  return {
    subscribe,
    set: (value) => set(getConvoIdFromURL(value)),
  };
})();

export const progressIndicator = writable(0);
