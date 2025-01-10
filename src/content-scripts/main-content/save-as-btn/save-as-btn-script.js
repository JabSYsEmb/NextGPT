import SaveAsBtnMain from "./save-as-btn.svelte";
import { advanceQuerySelector, downloadOptions, getConvoIdFromURL } from "../../../utils";

export async function saveAsBtnScript() {
  const main_content_right_corner = await advanceQuerySelector(".gap-2.pr-1.leading-\\[0\\]");

  // The check for the existence of #save-as-btn must be done after obtaining the main_content_right_corner element.
  // If this check is placed at the top of the function, it will always return false because the element is not yet available in the DOM.
  // While it could be improved, waiting for #save-as-btn using advanceQuerySelector is not a viable solution.
  if (document.querySelector("#save-as-btn")) return;

  const convo_id = getConvoIdFromURL(window.location.href);

  if (convo_id) {
    const div = document.createElement("div");
    div.classList.add("flex");

    new SaveAsBtnMain({
      target: main_content_right_corner.insertAdjacentElement("afterbegin", div),
      props: {
        convo_id,
        options: downloadOptions,
      },
    });
  }
}
