import { isValidURL } from "./utils";

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
export async function visitor(url, visit) {
  if (!isValidURL(url)) throw new Error("Invalid URL");
  url = new URL(url);

  let isDone;
  do {
    const response = await fetch(url);
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
export async function* iterator(url) {
  if (!isValidURL(url)) throw new Error("Invalid URL");
  url = new URL(url);

  let isDone;
  do {
    try {
      const response = await fetch(url);
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

export async function fetchFiles() {
  return await fetch("/backend-api/files")
    .then((res) => res.json())
    .then(({ files }) => files ?? []);
}

export async function fetchGizmos() {
  return await fetch("/backend-api/gizmos/bootstrap")
    .then((res) => res.json())
    .then(({ gizmos }) => gizmos.map((item) => item.resource.gizmo) ?? []);
}

export function getFetchAPIProxied() {
  window.fetch = new Proxy(window.fetch, {
    apply: async (target, thisArg, args) => {
      try {
        new URL(args[0]);
      } catch {
        args[0] = window.location.origin + args[0];
      }

      const url = new URL(args[0]);
      args[1] ??= { method: "GET" };

      /**@type {Response} */
      const res = await Reflect.apply(target, thisArg, args);

      if (!res.ok) return;

      switch (args[1].method) {
        case "POST":
          if (url.pathname !== "/backend-api/lat/r") break;

          // an artificial waiting for assuing that the conversation has been titled.
          await new Promise((res) => setTimeout(res, 1000));

          // this function called whenever the user send a POST request on /backend-api/lat/r which happens to be sent
          // in the following scenarios:
          // at the end of each repsonse
          // at naming a new conversation
          // ... to be continued to investigate.
          document.dispatchEvent(new CustomEvent("onPOST"));

          // if window location was starting with /g/ it means the user may create a new gizmo conver
          // therefore we neeed to dispatch an event to inject the gizmo script
          if (window.location.pathname.startsWith("/g/")) document.dispatchEvent(new CustomEvent("onGizmoPOST"));
          break;
        case "PATCH":
          // when user archive/delete/renmae a conversations
          const patchDetail = { url: url.toString(), options: args[1], ok: res.ok };
          document.dispatchEvent(new CustomEvent("onPATCH", { detail: patchDetail }));
          break;
        case "GET":
          if (url.pathname.endsWith("search")) {
            const clonedRes = res.clone();
            const query = url.searchParams.get("query");
            const { items } = await clonedRes.json().catch(() => null);
            if (items?.length) {
              const detail = { query, items: Object.groupBy(items, ({ conversation_id }) => conversation_id) };
              document.dispatchEvent(new CustomEvent("onSearch", { detail }));
            }
          }
          // users visit a new conversation by shallow navigating to it.
          // we need to check agains pathname has /g/ or /c/ otherwise any url has a conversation id
          // will pass the check for instance www.chatgpt.com/#fake-convo-id (will pass the check)
          if (hasConvoId(args[0])) {
            const payload = { detail: { actions: ["save-as-btn-script"] } };
            document.dispatchEvent(new CustomEvent("onGET", payload));
          }
      }

      return res;
    },
  });
}

/**
 * @param {string | URL} url
 * @returns {Boolean}
 */
function hasConvoId(url) {
  return !!url
    .toString()
    .match(/[a-fA-F0-9-]{36}/)
    ?.at(0);
}
