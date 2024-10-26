/**
 *
 * @param {string} selector
 * @param {{timeout: number, observerInit: MutationObserverInit}} options `timeout` in milliseconds and `observerInit` object
 * @param {HTMLElement | string} target
 * @returns {Promise<HTMLElement>} asuuming the selector is valid and exists
 * @description
 * For more agressive observer, please set the `observerInit` to `{ attributes: true }` which result in better selection
 * But it will require more cpu power consuption while observing the DOM.
 */
export function advanceQuerySelector(selector, options = {}, target = document.body) {
  Object.assign(options, {
    timeout: 10000,
    observerInit: {
      subtree: true,
      childList: true,
      attributes: false,
    },
  });

  return new Promise((res, err) => {
    if (!isValidSelector(selector)) {
      return err(`The provided css selector '${selector}' is not valid.`);
    }

    if (typeof target === "string") {
      if (!isValidSelector(target)) return err(`The provided target css selector '${target}' is not valid selector.`);
      target = document.querySelector(target);
    }

    let node = target.querySelector(selector);
    if (node) return res(node);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (((node = mutation.target.querySelector(selector)), node)) {
          cleanup();
          return res(node);
        }
      }
    });

    observer.observe(target, options.observerInit);

    const timeoutId = setTimeout(() => {
      cleanup();
      err(
        `[Timeout]: No element with the matching '${selector}' selector  has been found on the page within ${
          options.timeout / 1000
        } seconds.`
      );
    }, options.timeout);

    function cleanup() {
      observer.disconnect();
      clearTimeout(timeoutId);
    }
  });
}

/**
 *
 * @param {string} selector a valid css selector
 * @param {{timeout: number, observerInit: MutationObserverInit}} options `timeout` in milliseconds and `observerInit` object
 * @param {HTMLElement | string} target `HTMLElement` or a valid css selector string
 * @returns {Promise<Array<HTMLElement>>} asuuming the selector is valid and exists
 * @description For more agressive observer, please set the `observerInit` to `{ attributes: true}` which result in better selection
 * But it will require more cpu power consuption while observing the DOM.
 */
export function advanceQuerySelectorAll(selector, options = {}, target = document.body) {
  Object.assign(options, {
    timeout: 10000,
    observerInit: {
      subtree: true,
      childList: true,
      attributes: false,
    },
  });

  return new Promise((res, err) => {
    if (!isValidSelector(selector)) {
      return err(`The provided css selector '${selector}' is not valid.`);
    }

    if (typeof target === "string") {
      if (!isValidSelector(target)) {
        return err(`The provided target css selector '${target}' is not valid selector.`);
      }

      target = document.querySelector(target);
    }

    let node = target.querySelectorAll(selector);

    if (node.length) return res(Array.from(node));

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        node = mutation.target.querySelectorAll(selector);
        if (node.length) {
          cleanup();
          return res(Array.from(node));
        }
      }
    });

    observer.observe(target, options.observerInit);

    const timeoutId = setTimeout(() => {
      cleanup();
      err(
        `[Timeout]: No element with the matching '${selector}' selector  has been found on the page within ${
          options.timeout / 1000
        } seconds.`
      );
    }, options.timeout);

    function cleanup() {
      observer.disconnect();
      clearTimeout(timeoutId);
    }
  });
}

function isValidSelector(selector) {
  try {
    document.querySelector(selector);
    return true;
  } catch (_) {
    return false;
  }
}
