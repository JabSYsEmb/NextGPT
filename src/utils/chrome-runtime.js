/**
 * @param {import('./types.d').ActionType} action
 * @returns Promise<any>
 */
export function invoke(action) {
  return chrome.runtime.sendMessage({
    action,
  });
}
