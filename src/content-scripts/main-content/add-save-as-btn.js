import SaveAsBtnMain from "./save-as-btn.svelte";
import { advanceQuerySelector, downloadOptions, getConvoIdFromURL } from "../../utils";

export async function addSaveAsBtnScript() {
  const main_content_right_corner = await advanceQuerySelector(".gap-2.pr-1.leading-\\[0\\]");
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
