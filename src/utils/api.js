import { isValidURL } from "./utils";
import { get } from "svelte/store";
import { auth } from "../stores";

/**
 * @typedef {import('../types.d').DataItemType} DataItemType
 * @typedef {import('../types.d').DataType} DataType
 * @typedef {import('../types.d').AuthType} AuthType
 */

/**
 *
 * @param {string} baseURL
 * @param {(res: Array<DataItemType>) => void} visit
 * @returns
 */
export async function visitor(url, visit, options = get(auth)) {
  if (!isValidURL(url)) throw new Error("Invalid URL");
  url = new URL(url);

  let isDone;
  do {
    const response = await fetch(url, options);
    /**@type {DataType} */
    const { items, limit, offset, total } = await response.json();
    url.searchParams.set("offset", offset + limit);
    isDone = offset + limit >= total;
    visit(items);
  } while (!isDone);

  return;
}

/**
 *
 * @param {string} url url to iterate over
 * @param {AuthType} options authentication object for `fetch` function
 * @returns
 */
export async function* iterator(url, options = get(auth)) {
  if (!isValidURL(url)) throw new Error("Invalid URL");
  url = new URL(url);

  let isDone;
  do {
    try {
      const response = await fetch(url, options);
      /**@type {import('../types.d').DataType} */
      const { items, limit, offset, total } = await response.json();
      url.searchParams.set("offset", offset + limit);
      isDone = offset + limit >= total;
      yield items;
    } catch (_) {
      break;
    }
  } while (!isDone);

  return;
}

export async function authenticatedFetch(url) {
  if (!get(auth)) throw new Error("not authenticated, try again!");
  if (!isValidURL(url)) throw new Error("Invalid URL");

  return fetch(url, get(auth));
}
