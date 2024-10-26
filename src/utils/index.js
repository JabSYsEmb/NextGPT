export async function injectAuthroizationKeyGetterScript() {
  return chrome.runtime.sendMessage({
    action: "inject-authorization-key-getter-script",
  });
}
