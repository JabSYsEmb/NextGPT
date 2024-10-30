export function polyfillFindLast() {
  Array.prototype.findLast = function (callback) {
    return this.reverse().find(callback);
  };
}

export function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 *
 * @param {() => void | Promise<unknown>} fn
 * @param {{ms: number, isPromise: Boolean}} options
 * @returns {number | Promise<void>} if isPromise is true, it returns a promise, else it returns a setTimeoutId
 * @description creates an artificial delay and return it as promise, this is useful for assuring
 * some states have been updated before proceeding to the next function call...
 * @example
 * import { auth } from "$lib/stores";
 * (async() => {
 * auth.set({headers: "Bearer $$$$$$"});
 * // if a function is using auth and called after the set immediatly, it will not have the updated value
 * // therefore we can use `delay()` to wait for the store to update before calling the function
 * await delay(1000);
 * preceed()....;
 * })();
 */
export async function delay(fn, { ms, isPromise } = { ms: 1000, isPromise: false }) {
  if (!!isPromise)
    return new Promise((res) =>
      setTimeout(async () => {
        const data = await fn();
        res(data);
      }, ms)
    );

  return setTimeout(fn, ms);
}

/**
 * @param {string | URL} url
 */
export function getConvoIdFromURL(url) {
  return url
    .toString()
    .match(/[a-fA-F0-9-]{36}/)
    ?.at(0);
}
