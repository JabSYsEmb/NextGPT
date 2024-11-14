/**
 * @param {import('../types.d').ActionType} action a valid action type
 * @returns {Promise<any>} a promise that resolves to the response from the background script
 */
export async function invoke(action) {
  return browser.runtime.sendMessage({ action });
}
