(() => {
  var s = document.createElement("script");
  s.src = browser.runtime.getURL("src/auth/auth.js");

  s.onload = function () {
    this.parentNode.removeChild(this);
    this.remove();
  };

  (document.head || document.documentElement).appendChild(s);
})();

undefined;
