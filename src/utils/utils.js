import { get } from "svelte/store";
import { auth } from "../stores";

export function polyfillFindLast() {
  Array.prototype.findLast = function (callback) {
    return this.reverse().find(callback);
  };
}

export const HTMLParserSingleton = (() => {
  let parserInstance;

  class HTMLParser {
    constructor() {
      if (!parserInstance) {
        parserInstance = new DOMParser();
      }
      return parserInstance;
    }

    static parseHTML(htmlString) {
      return parserInstance.parseFromString(htmlString, "text/html").body.firstElementChild;
    }
  }

  return HTMLParser;
})();

/**
 *
 * @param {string} baseURL
 * @param {(res: Array<import('./types.d').DataItemType>) => void} visit
 * @returns
 */
export async function visitor(url, visit, options = get(auth)) {
  if (!isValidURL(url)) throw new Error("Invalid URL");
  url = new URL(url);

  let isDone;
  do {
    const response = await fetch(url, options);
    /**@type {import('./types.d').DataType} */
    const { items, limit, offset, total } = await response.json();
    url.searchParams.set("offset", offset + limit);
    isDone = offset + limit >= total;
    visit(items);
  } while (!isDone);

  return;
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
