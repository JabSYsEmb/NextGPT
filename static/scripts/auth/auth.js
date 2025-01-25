(function () {
  const { accessToken } = (window.__reactRouterContext || window.__remixContext).state.loaderData.root.clientBootstrap
    .session;

  if (!accessToken) {
    document.dispatchEvent(new CustomEvent("onAuth", { detail: { auth: undefined }, cancelable: false }));
    return;
  }

  document.dispatchEvent(
    new CustomEvent("onAuth", {
      detail: {
        auth: {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          referrer: "https://chatgpt.com/",
          method: "GET",
          mode: "cors",
        },
      },
      cancelable: false,
    })
  );
})();
