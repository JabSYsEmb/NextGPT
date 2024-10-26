import { injectAuthroizationKeyGetterScript } from "./utils";
import Dropdown from "./dropdown-list.svelte";

injectAuthroizationKeyGetterScript();

new Dropdown({
  target: document.body,
  props: {
    items: [
      { id: 1, text: "Item 1" },
      { id: 2, text: "Item 2" },
      { id: 3, text: "Item 3" },
    ],
  },
});
