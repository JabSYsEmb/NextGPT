import { advanceQuerySelector, advanceXPathSelector } from "../utils";
import instrumentSidebar from "./sidebar/sidebar-instruments";

export async function sidebarScript() {
  // It's not possible to querying the nav immediatly as we need to sure it's fully hydrated
  // and it's possible that by querying on `nav a[href="/"]`, and then we instrument the sidebar
  const _ = await advanceQuerySelector('nav a[href="/"]');
  const nav = await advanceXPathSelector("/html/body/div[1]/div[1]");

  instrumentSidebar(nav);
}
