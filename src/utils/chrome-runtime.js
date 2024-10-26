export async function invoke(action) {
  return chrome.runtime.sendMessage({
    action,
  });
}

// "inject-authorization-key-getter"
// "inject-save-as-btn-builder"
// "inject-events-disptacher"
// "inject-proxied-window-fetch-function"
