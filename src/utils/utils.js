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
 * @param {number} ms  milliseconds
 * @returns {Promise<void>}
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
export async function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
