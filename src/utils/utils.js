export function polyfillFindLast() {
  Array.prototype.findLast = function (callback) {
    return this.reverse().find(callback);
  };
}

export function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 *
 * @param {() => void | Promise<unknown>} fn
 * @param {{ms: number, isPromise: Boolean}} options
 * @returns {number | Promise<void>} if isPromise is true, it returns a promise, else it returns a setTimeoutId
 * @description creates an artificial delay and return it as promise, this is useful for assuring
 * some states have been updated before proceeding to the next function call...
 * @example
 * import { auth } from "$lib/stores";
 * (async() => {
 * auth.set({headers: "Bearer $$$$$$"});
 * // if a function is using auth and called after the set immediatly, it will not have the updated value
 * // therefore we can use `delay()` to wait for the store to update before calling the function
 * await delay(1000);
 * preceed()....;
 * })();
 */
export async function delay(fn, { ms, isPromise } = { ms: 1000, isPromise: false }) {
  if (!!isPromise)
    return new Promise((res) =>
      setTimeout(async () => {
        const data = await fn();
        res(data);
      }, ms)
    );

  return setTimeout(fn, ms);
}

/**
 * @param {string | URL} url
 */
export function getConvoIdFromURL(url) {
  return url
    .toString()
    .match(/[a-fA-F0-9-]{36}/)
    ?.at(0);
}

export function getCookiesObj() {
  return document.cookie.split(";").reduce((cookies, cookie) => {
    const [name, value] = cookie.split("=").map((c) => c.trim());
    cookies[name] = decodeURIComponent(value); // decodeURIComponent handles URL encoding
    return cookies;
  }, {});
}

export function getCookie(name) {
  return getCookiesObj()[name];
}

export function initializeLocalStorage(kname) {
  if (localStorage.getItem(kname)) return localStorage.getItem(kname);
  const init = JSON.stringify({});
  localStorage.setItem(kname, init);
  return init;
}

export function getLocalStorageAsOb(kname) {
  if (!isLocalStorageExist(kname)) initializeLocalStorage(kname);
  return JSON.parse(localStorage.getItem(kname));
}

export function appendToLocalStorage(kname, data) {
  if (!isLocalStorageExist(kname)) initializeLocalStorage(kname);
  const curr = JSON.parse(localStorage.getItem(kname));
  localStorage.setItem(kname, JSON.stringify({ ...curr, ...data }));
}

export function updatePropertyInLocalStorage(kname, prop, value) {
  if (!isLocalStorageExist(kname)) initializeLocalStorage(kname);
  const curr = JSON.parse(localStorage.getItem(kname));
  if (value && typeof value === "object") curr[prop] = { ...curr[prop], ...value };
  else curr[prop] = value;
  return localStorage.setItem(kname, JSON.stringify(curr));
}

export function getPropertyFromLocalStorage(kname, prop) {
  if (!isLocalStorageExist(kname)) return undefined;
  return JSON.parse(localStorage.getItem(kname))[prop];
}

export function removeLocalStorage(kname) {
  if (!isLocalStorageExist(kname)) return false;
  localStorage.removeItem(kname);
  return true;
}

function isLocalStorageExist(kname) {
  return localStorage.getItem(kname);
}

// this function needs to be called when ever a change is made to the indexedDB
export function dispatchValidateDB(name = window.userId) {
  return window.dispatchEvent(new CustomEvent("validate-db", { detail: { db: name } }));
}

export function getIndexedDBProxied() {
  // get put/delete/add methods from IDBObjectStore proxied to dispatchValidateDB
  // each time are being called
  const proxyIDBObjectStore = {
    apply(target, thisArg, args) {
      dispatchValidateDB();
      return Reflect.apply(target, thisArg, args);
    },
  };

  IDBObjectStore.prototype.put = new Proxy(IDBObjectStore.prototype.put, proxyIDBObjectStore);
  IDBObjectStore.prototype.delete = new Proxy(IDBObjectStore.prototype.delete, proxyIDBObjectStore);
  IDBObjectStore.prototype.add = new Proxy(IDBObjectStore.prototype.add, proxyIDBObjectStore);
}
