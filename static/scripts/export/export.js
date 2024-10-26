(() => {
  const headers = {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${window.__remixContext.state.loaderData.root.clientBootstrap.session.accessToken}`,
    },
    referrer: "https://chatgpt.com/",
    method: "GET",
    mode: "cors",
  };

  const chattyBtn = document.querySelector("#chatty-btn");

  [{ format: "PDF" }, { format: "DOCX" }, { format: "MD" }, { format: "JSON" }].forEach(async ({ format }) => {
    const optionBtn = document.querySelector(`#${format}-option`);

    if (!optionBtn || !chattyBtn) return;

    optionBtn.addEventListener("click", async () => {
      const data = await fetch(`/backend-api/conversation/${window.location.pathname.split("/")[2]}`, headers).then(
        (res) => res.json()
      );

      chattyBtn.dispatchEvent(
        new CustomEvent("onExport", {
          detail: {
            format: format.toLowerCase(),
            data: data,
          },
        })
      );
    });
  });
})();
