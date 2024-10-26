(() => {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL("src/proxy/proxy.js");

  s.onload = function () {
    this.remove();
  };

  (document.head || document.documentElement).appendChild(s);
})();
