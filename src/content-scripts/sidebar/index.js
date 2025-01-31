import { advanceQuerySelector, advanceXPathSelector } from "../../utils";
import hicakingAnchorClickScript from "./hijack-anchor-click-event";
import contextMenuFeatureScript from "./context-menu-feature";
import slidingFeatureScript from "./sliding-feature";
import convoboxFeatureScript from "./convobox-feature";
import searchFeatureScript from "./search-feature";

export async function sidebarScript() {
  // Ensure the navigation element is fully loaded and hydrated before querying.
  const _ = await advanceQuerySelector('nav a[href="/"]'); // waiting for a[href] to be added to the DOM
  const nav = await advanceXPathSelector("/html/body/div[1]/div/div[1]/div[1]");

  if (!nav) return console.error(`[error]: Sidebar not found!`);

  slidingFeatureScript(nav);
  convoboxFeatureScript(nav);

  contextMenuFeatureScript(nav);
  hicakingAnchorClickScript(nav);
  searchFeatureScript(nav);
}
