import { writable } from "svelte/store";

/**@type {import('svelte/store').Writable<import('../types.d').AuthType | undefined>} */
export const auth = writable(undefined);
