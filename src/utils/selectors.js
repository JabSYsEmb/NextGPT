/**
 *
 * @param {string} selector
 * @param {HTMLElement | string} target
 * @param {number} timeout in milliseconds
 * @returns {Promise<HTMLElement>} asuuming the selector is valid and exists
 */
export function advanceQuerySelector(selector, target = document.body, timeout = 10000) {
  return new Promise((res, err) => {
    if (!isValidSelector(selector)) {
      return err(`The provided css selector '${selector}' is not valid.`);
    }

    if (typeof target === "string") {
      if (!isValidSelector(target)) return err(`The provided target css selector '${target}' is not valid selector.`);
      target = document.querySelector(target);
    }

    let node = target.querySelector(selector);
    if (node) res(node);

    const observer = new MutationObserver((mutations, observe) => {
      for (const mutation of mutations) {
        if (((node = mutation.target.querySelector(selector)), node)) {
          observe.disconnect();
          clearTimeout(timeoutId);
          return res(node);
        }
      }
    });

    /**
     * Aggressively observer target node and its subtree for any changes (addition/removal of nodes)
     * for more cpu-friendly approach, consider setting attributes to `false` but this may result in a poor selection.
     */
    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    const timeoutId = setTimeout(() => {
      observer.disconnect();
      err(
        `[Timeout]: No element with the matching '${selector}' selector  has been found on the page within ${
          timeout / 1000
        } seconds.`
      );
    }, timeout);
  });
}

/**
 *
 * @param {string} selector a valid css selector
 * @param {HTMLElement | string} target `HTMLElement` or a valid css selector string
 * @param {number} timeout in milliseconds
 * @returns {Promise<Array<HTMLElement>>} asuuming the selector is valid and exists
 */
export function advanceQuerySelectorAll(selector, target = document.body, timeout = 10000) {
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

    if (node.length) return res(node);

    const observer = new MutationObserver((mutations, observe) => {
      for (const mutation of mutations) {
        node = mutation.target.querySelectorAll(selector);
        if (node.length) {
          observe.disconnect();
          clearTimeout(timeoutId);
          return res(node);
        }
      }
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    const timeoutId = setTimeout(() => {
      observer.disconnect();
      err(
        `[Timeout]: No element with the matching '${selector}' selector  has been found on the page within ${
          timeout / 1000
        } seconds.`
      );
    }, timeout);
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
