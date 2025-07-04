window.history.pushState = new Proxy(window.history.pushState, {
  apply: (target, thisArg, args) => {
    const navigateToLocation = args[2];
    const currentLocation = window.location.pathname;
    document.dispatchEvent(new CustomEvent("onNavigate", { detail: { navigateToLocation, currentLocation } }));
    return Reflect.apply(target, thisArg, args);
  },
});

window.fetch = new Proxy(window.fetch, {
  apply: async function(_target, _thisArg, args) {
    const url = new URL(args[0]);

    /**@type {Response} */
    const res = await Reflect.apply(...arguments);

    if (args[1]?.signal) {
      return res;
    }

    if (!res.ok) return;



    //* @property {{path: URL | string }} [properties]
    switch (args[1]?.method?.toUpperCase()) {
      case "POST":
        if (url.pathname === "/ces/v1/t") {
          /** @type {TrackBody} */
          const { event } = JSON.parse(args[1].body);
          switch (event) {
            case "Create New Thread":
              await new Promise((res) => setTimeout(res, 1000));
              document.dispatchEvent(new CustomEvent("onPOST"));
              break;

            case "Rename Thread":
              /**@type {RenameBody} */
              const rbody = JSON.parse(args[1].body)
              const patchDetail = { url: rbody.properties.threadId, rename: rbody.properties.content, ok: res.ok }
              document.dispatchEvent(new CustomEvent("onRename", { detail: patchDetail }));
              break;

            case "Conversation Archived":
            case "Conversation Deleted":
              /**@type {ActionBody} */
              const cbody = JSON.parse(args[1].body)
              break;

            default:
              console.debug(`event: ${event} not handled by NextGPT - if you think it's usefull to handle it please open a PR/Issue`);
          }
        };

        if (url.pathname === "/ces/v1/p") {
          /** @type {PageBody} */
          const body = JSON.parse(args[1].body);
          if (hasConvoId(body.properties.path)) {
            const payload = { detail: { actions: ["save-as-btn-script"] } };
            document.dispatchEvent(new CustomEvent("onGET", payload));
          }
        }
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

        break;
    }

    return res;
  },
});

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

/**
 * @typedef {Object} TrackBody
 * @property {'FannyPack: Click result' | 'Conversation' | 'Conversation Archived' | 'Conversation Deleted' | 'Conversation History Item Open Menu' | 'Load Thread' | 'Rename Thread' | 'Create New Thread'} event
 */

/**
 * @typedef {Object} PageBody
 * @property {{ path: string | URL; search: string; }} properties
 */

/**
 * @typedef {Object} RenameBody
 * @property {{content: string; threadId: string}} properties
 */

/**
 * @typedef {Object} ActionBody
 * @property {{page: PageBody}} context
 */
