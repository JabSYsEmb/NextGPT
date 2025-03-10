/**
 *
 * @param {string} selector
 * @param {{timeout: number | undefined, observerInit: MutationObserverInit | undefined, target: HTMLElement | string | undefined}} options `timeout` in milliseconds and `observerInit` object
 * @returns {Promise<HTMLElement>} asuuming the selector is valid and exists
 * @description
 * For more agressive observer, please set the `observerInit` to `{ attributes: true }` which result in better selection
 * But it will require more cpu power consuption while observing the DOM.
 */
export function advanceQuerySelector(selector, options = {}) {
  options = Object.assign(
    {
      target: document.body,
      timeout: 10000,
      observerInit: {
        subtree: true,
        childList: true,
        attributes: false,
      },
    },
    options
  );

  let target = options.target;
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
        node = mutation.target.querySelector(selector)
        if (node) {
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
 * @param {{timeout: number, observerInit: MutationObserverInit, target: HTMLElement | string}} options `timeout` in milliseconds and `observerInit` object
 * @returns {Promise<NodeList<HTMLElement>>} asuuming the selector is valid and exists
 * @description For more agressive observer, please set the `observerInit` to `{ attributes: true}` which result in better selection
 * But it will require more cpu power consuption while observing the DOM.
 */
export function advanceQuerySelectorAll(selector, options = {}) {
  options = Object.assign(
    {
      target: document.body,
      timeout: 10000,
      observerInit: {
        subtree: true,
        childList: true,
        attributes: false,
      },
    },
    options
  );

  let target = options.target;

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

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        node = mutation.target.querySelectorAll(selector);
        if (node.length) {
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
 * @param {string} xpath
 * @param {{timeout: number, observerInit: MutationObserverInit, target: HTMLElement | string}} options
 * @returns {Promise<HTMLElement>} asuuming the xpath is valid and exists
 * @description !!!Please `DON'T` use this function unless you test it on all browsers you are targeting
 * as browsers tend to have different DOM structures and this may cause in false selections
 */
export function advanceXPathSelector(xpath, options = {}) {
  options = Object.assign(
    {
      timeout: 10000,
      target: document.body,
      observerInit: {
        subtree: true,
        childList: true,
        attributes: false,
      },
    },
    options
  );
  let target = options.target;

  return new Promise((res, err) => {
    // Validate and set the target
    if (typeof xpath !== "string") return err(`Invalid XPath: '${xpath}'`);

    if (typeof target === "string") {
      const resolvedTarget = document.querySelector(target);
      if (!resolvedTarget) return err(`Target XPath '${target}' did not match any element.`);
      target = resolvedTarget;
    }

    const evaluateXPath = () =>
      document.evaluate(xpath, target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    let node = evaluateXPath();
    if (node) return res(node);

    const observer = new MutationObserver(() => {
      node = evaluateXPath();
      if (node) {
        cleanup();
        return res(node);
      }
    });

    observer.observe(target, options.observerInit);

    const timeoutId = setTimeout(() => {
      cleanup();
      err(`[Timeout]: No elements matched '${xpath}' within ${options.timeout / 1000} seconds.`);
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
