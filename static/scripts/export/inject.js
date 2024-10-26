var s = document.createElement("script");
s.src = chrome.runtime.getURL("src/export/export.js");

s.onload = function () {
  this.parentNode.removeChild(this);
  this.remove();
};

(document.head || document.documentElement).appendChild(s);

var button = document.createElement("button");
button.setAttribute("id", "chatty-btn");

button.addEventListener("onExport", (e) => {
  chrome.runtime.sendMessage({
    action: "export",
    ...e.detail,
  });
});

(document.body || document.documentElement).appendChild(button);
