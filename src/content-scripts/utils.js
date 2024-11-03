/**
 *
 * @param {string} url
 */
export function shallowTo(url) {
  window.history.replaceState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
  document.dispatchEvent(new CustomEvent("onURLChange", { detail: { url } }));
}
