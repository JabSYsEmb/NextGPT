import { writable } from "svelte/store";

export const url = (function (init = window.location.pathname) {
  const { subscribe, set } = writable(init);

  return {
    subscribe,
    set,
  };
})();

export const progressIndicator = writable(0);
