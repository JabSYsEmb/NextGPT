import { writable } from "svelte/store";

/**
 * @type {import('svelte/store').Writable<import('../types.d').UserType | null>}
 */
export const user = writable(null);
