/**
 * @typedef { "auth" | "export" | "proxy" } ActionType
 */

/**
 * @typedef {Object} AuthType
 * @property {RequestCredentials} credentials
 * @property {Headers} headers
 * @property {string | URL} referrer
 * @property {"GET"} method
 * @property {RequestMode} mode
 */

/**
 * @typedef {Object} OnAuthEvent
 * @property {AuthType} auth
 */

/**
 * @typedef {Object} FetchOptions
 * @property {RequestCredentials} credentials
 * @property {"GET" | "POST" | "PATCH" | "DELETE" | "PUT"} method
 * @property {Headers} headers
 * @property {Object | undefined} body
 */

/**
 * @typedef {Object} OnFetchEvent
 * @property {string} url
 * @property {boolean} ok
 * @property {FetchOptions} options
 */

/**
 * @typedef {Object} PatchBodyRequest
 * @type {{is_visible: boolean} | {is_archived: boolean} | {title: string}}
 */

/**
 * @typedef {Object} OnNavigateEvent
 * @property {string} navigateToLocation // URL to navigate to
 * @property {string} currentLocation    // URL of the current location
 */

export default {};
