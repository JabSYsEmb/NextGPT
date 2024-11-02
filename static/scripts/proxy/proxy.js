window.history.pushState = new Proxy(window.history.pushState, {
  apply: (target, thisArg, args) => {
    const navigateToLocation = args[2];
    const currentLocation = window.location.pathname;
    document.dispatchEvent(new CustomEvent("onNavigate", { detail: { navigateToLocation, currentLocation } }));
    document.dispatchEvent(new CustomEvent("onURLChange", { detail: { url: navigateToLocation } }));
    return Reflect.apply(target, thisArg, args);
  },
});

window.fetch = new Proxy(window.fetch, {
  apply: async (target, thisArg, args) => {
    const url = new URL(args[0]);
    const res = await Reflect.apply(target, thisArg, args);

    switch (args[1].method) {
      case "POST":
        const postDetail = { url: url.toString(), body: args[1].body };
        document.dispatchEvent(new CustomEvent("onPOST", { detail: postDetail }));
        break;
      case "PATCH":
        const patchDetail = { url: url.toString(), options: args[1], ok: res.ok };
        document.dispatchEvent(new CustomEvent("onPATCH", { detail: patchDetail }));
        break;
      case "GET":
        if (hasConvoId(args[0]))
          document.dispatchEvent(new CustomEvent("onGET", { detail: { action: "save-as-btn" } }));
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
