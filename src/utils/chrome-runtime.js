/**
 * @param {import('./types.d').ActionType} action
 * @param {() => {}} fn
 * @returns Promise<any>
 */
export async function invokeAction(action, fn = null) {
  if (fn && typeof fn === "function") {
    fn.call(null);
  }

  return chrome.runtime.sendMessage({
    action,
  });
}
