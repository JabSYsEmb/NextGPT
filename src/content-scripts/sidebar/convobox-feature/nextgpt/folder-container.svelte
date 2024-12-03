<script>
  import { NewFolderIcon } from "../../../../icons";
  import { Button, Dialog } from "../../../components";

  /**@type {HTMLDialogElement | undefined}*/
  let dialog;
</script>

<Button
  borderRadius="0.375rem"
  outlineWidth="1px"
  outlineColor="#eeeeee"
  width="fit-content"
  height="100%"
  on:click={() => dialog?.showModal()}
>
  <NewFolderIcon />
</Button>

<Dialog bind:dialog>
  <span>hello new folder component</span>

  <div slot="footer">
    <Button height="100%" on:click={() => dialog.close()}>close</Button>
  </div>
</Dialog>
