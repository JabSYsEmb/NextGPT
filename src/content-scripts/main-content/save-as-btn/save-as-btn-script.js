import SaveAsBtnMain from "./save-as-btn.svelte";
import { advanceQuerySelector, downloadOptions, getConvoIdFromURL } from "../../../utils";

export async function saveAsBtnScript() {
  const main_content_right_corner = await advanceQuerySelector(".gap-2.pr-1.leading-\\[0\\]");

  // the checking for the existing of #save-as-btn is necessary to be checked after
  // getting the main_content_right_corner element... if the checking was placed at the top of the function
  // it will be always false because the element is not yet available in the DOM
  // (make it could be done better but waiting for #save-as-btn using advanceQuerySelector is not a good idea)
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
