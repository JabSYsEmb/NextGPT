import { advanceXPathSelector, advanceQuerySelector } from "./utils";
import instrumentSidebar from "./content-scripts/sidebar-instruments";
import { invoke } from "./utils";
import { auth } from "./stores";

invoke("auth", () =>
  document.addEventListener("onAuth", (/**@type {CustomEvent<{auth: Object}>}*/ e) => auth.set(e.detail.auth))
);

//

advanceQuerySelector("nav a[href='/']").then(async () => {
  const nav = await advanceXPathSelector("/html/body/div[1]/div[1]");
  instrumentSidebar(nav);
});
