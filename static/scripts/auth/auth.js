document.dispatchEvent(
  new CustomEvent("onAuth", {
    detail: {
      auth: {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${window.__remixContext.state.loaderData.root.clientBootstrap.session.accessToken}`,
        },
        referrer: "https://chatgpt.com/",
        method: "GET",
        mode: "cors",
      },
    },
    cancelable: false,
  })
);
