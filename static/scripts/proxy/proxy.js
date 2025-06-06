window.history.pushState = new Proxy(window.history.pushState, {
  apply: (target, thisArg, args) => {
    const navigateToLocation = args[2];
    const currentLocation = window.location.pathname;
    document.dispatchEvent(new CustomEvent("onNavigate", { detail: { navigateToLocation, currentLocation } }));
    return Reflect.apply(target, thisArg, args);
  },
});

window.fetch = new Proxy(window.fetch, {
  apply: async function (_target, _thisArg, args) {
    const url = new URL(args[0]);

    /**@type {Response} */
    const res = await Reflect.apply(...arguments);

    if (args[1]?.signal) {
      return res;
    }

    if (!res.ok) return;

    switch (args[1]?.method) {
      case "POST":
        if (url.pathname !== "/backend-api/lat/r") break;

        // an artificial waiting for assuing that the conversation has been titled.
        await new Promise((res) => setTimeout(res, 1000));

        // this function called whenever the user send a POST request on /backend-api/lat/r which happens to be sent
        // in the following scenarios:
        // at the end of each repsonse
        // at naming a new conversation
        // ...
        document.dispatchEvent(new CustomEvent("onPOST"));

        // if window location was starting with /g/ it means the user may create a new gizmo conver
        // therefore we neeed to dispatch an event to inject the gizmo script
        if (window.location.pathname.startsWith("/g/")) document.dispatchEvent(new CustomEvent("onGizmoPOST"));
        break;

      case "PATCH":
        //     // when user archive/delete/renmae a conversations
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

        // Users visit a new conversation by shallow navigating to it.
        // We need to check if the pathname has /g/ or /c/, otherwise any URL with a conversation ID
        // will pass the check. For instance, www.chatgpt.com/#fake-convo-id would pass the check.
        if (hasConvoId(args[0])) {
          const payload = { detail: { actions: ["save-as-btn-script"] } };
          document.dispatchEvent(new CustomEvent("onGET", payload));
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
