window.history.pushState = new Proxy(window.history.pushState, {
  apply: (target, thisArg, args) => {
    const navigateToLocation = args[2];
    const currentLocation = window.location.pathname;
    document.dispatchEvent(new CustomEvent("onNavigate", { detail: { navigateToLocation, currentLocation } }));
    return Reflect.apply(target, thisArg, args);
  },
});

window.fetch = new Proxy(window.fetch, {
  apply: async (target, thisArg, args) => {
    const url = new URL(args[0]);
    const res = await Reflect.apply(target, thisArg, args);

    switch (args[1].method) {
      case "POST":
        if (url.pathname !== "/backend-api/lat/r") break;

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
