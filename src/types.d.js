/**
 * @typedef { "auth" | "export" | "proxy" } ActionType
 */

import { SvelteComponent } from "svelte";

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

/**
 * @typedef {Object} DataType
 * @property {Array<DataItemType>} items
 * @property {number} total
 * @property {number} limit
 * @property {number} offset
 */

/**
 * @typedef {Object} DataItemType
 * @property {string} id
 * @property {string} title
 * @property {string} create_time
 * @property {string} update_time
 * @property {string | null} mapping
 * @property {string | null} current_node
 * @property {string | null} conversation_template_id
 * @property {string | null} gizmo_id
 * @property {boolean} is_archived
 * @property {string | null} workspace_id
 * @property {string | null} async_status
 * @property {Array<string>} safe_urls
 * @property {string | null} conversation_origin
 */

/**
 * @typedef {Object} SaveBtnOptionType
 * @property {string} format
 * @property {boolean} available
 * @property {SvelteComponent<{width?: string, height?: string, class?: string}>} Icon
 */

//   {
//     format: "DOCX",
//     available: false,
//     Icon: DocxIcon,
//   },

export default {};
