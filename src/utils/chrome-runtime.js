/**
 * @param {import('./types.d').ActionType} action a valid action type
 * @param {() => {}} fn a function to be called before invoking the action
 * @returns {Promise<any>} a promise that resolves to the response from the background script
 */
export async function invoke(action, fn = null) {
  if (fn && typeof fn === "function") {
    fn.call(null);
  }

  return chrome.runtime.sendMessage({ action });
}
