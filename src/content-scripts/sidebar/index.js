import { advanceQuerySelector, advanceXPathSelector } from "../../utils";
import hicakingAnchorClickScript from "./hijack-anchor-click-event";
import contextMenuFeatureScript from "./context-menu-feature";
import slidingFeatureScript from "./sliding-feature";
import convoboxFeatureScript from "./convobox-feature";
import searchFeatureScript from "./search-feature";

export async function sidebarScript() {
  // It's not possible to querying the nav immediatly as we need to sure it's fully hydrated
  // and it's possible that by querying on `nav a[href="/"]`, and then we instrument the sidebar
  const _ = await advanceQuerySelector('nav a[href="/"]');
  const nav = await advanceXPathSelector("/html/body/div[1]/div[1]");

  if (!nav) return console.error(`[error]: Sidebar not found!`);

  slidingFeatureScript(nav);
  convoboxFeatureScript(nav);

  contextMenuFeatureScript(nav);
  hicakingAnchorClickScript(nav);
  searchFeatureScript(nav);
}
