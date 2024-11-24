<script>
  import { getPropertyFromLocalStorage, updatePropertyInLocalStorage } from "../../../utils/utils";

  /**@type {HTMLElement} */
  export let nextgptContainer;
  /**@type {HTMLElement | undefined} */
  export let chatgptContainer = nextgptContainer.parentElement.querySelector("div:not([class])");

  const parentElement = nextgptContainer?.parentElement;

  function switchConvoBox(switchToChatGPTView) {
    if (!chatgptContainer) chatgptContainer = parentElement.querySelector("div:not([class])");

    switchToChatGPTView ? switchToChatGPT() : switchToNextGPT();
  }

  function switchToChatGPT() {
    if (isChatGPTConvoView || !chatgptContainer) return;

    chatgptContainer.classList.remove("hidden");
    nextgptContainer.classList.add("hidden");

    updatePropertyInLocalStorage(window.userId, "view", "chatgpt");
    isChatGPTConvoView = true;
  }

  function switchToNextGPT() {
    if (!isChatGPTConvoView) return;

    nextgptContainer.classList.remove("hidden");
    if (chatgptContainer) chatgptContainer.classList.add("hidden");

    updatePropertyInLocalStorage(window.userId, "view", "nextgpt");
    isChatGPTConvoView = false;
  }

  function useSwitch() {
    if (!isSwitchEquiped || getPropertyFromLocalStorage(window.userId, "view") === "nextgpt") switchToNextGPT();
  }

  const isSwitchEquiped = !!chatgptContainer && !!nextgptContainer;

  let isChatGPTConvoView = true;

  // complex logic
  function observeAdditionOfChatgptConvoBox() {
    if (!parentElement) return;

    new MutationObserver((mutations, observer) => {
      for (let mut of mutations) {
        if (mut.previousSibling === nextgptContainer && mut.addedNodes[0]?.localName === "div") {
          chatgptContainer = mut.addedNodes[0];
          document.getElementById("chatgpt-btn").click();
          observeDeletionOfChatgptConvoBox();
          observer.disconnect();
        }
      }
    }).observe(parentElement, { childList: true });
  }

  function observeDeletionOfChatgptConvoBox() {
    new IntersectionObserver((entries, observer) => {
      if (!entries[0].target.parentElement) {
        document.getElementById("nextgpt-btn").click();
        observeAdditionOfChatgptConvoBox();
        chatgptContainer = undefined;
        observer.disconnect();
      }
    }).observe(chatgptContainer);
  }

  // if no chats are present, switch to nextGPT and wait for a new convo to be added.
  // if chats are present, switch to chatGPT and wait for the chat to be deleted.
  (!!chatgptContainer ? observeDeletionOfChatgptConvoBox : observeAdditionOfChatgptConvoBox)();
</script>

<div class:nextgpt={!isChatGPTConvoView} use:useSwitch>
  <button
    id="chatgpt-btn"
    class:active={isChatGPTConvoView}
    data-msg={!chatgptContainer && "No active chat exists!"}
    aria-disabled={!chatgptContainer}
    title={!chatgptContainer ? "Your ChatGPT inbox empty, no switch could be invoked" : "Switch to ChatGPT"}
    on:click={switchConvoBox.bind(null, true)}
  >
    ChatGPT
  </button>
  <button
    id="nextgpt-btn"
    class:active={!isChatGPTConvoView}
    title={"Switch to NextGPT"}
    on:click={switchConvoBox.bind(null, false)}
  >
    NextGPT
  </button>
</div>

<style>
  [aria-disabled="true"] {
    --outline-color: light-dark(#776f6f, #ffffff);
  }

  [aria-disabled="true"]::before {
    display: none;
    opacity: 0;
    transition-property: display opacity;
    transition-behavior: allow-discrete;
    transition-duration: 300ms;
    content: attr(data-msg);
    position: absolute;
    justify-content: center;
    align-items: center;
    min-height: 3ch;

    padding-inline: 2ch;

    height: fit-content;
    width: max-content;

    padding-inline: 4px;
    padding-block: 2px;
    top: 0;
    left: 50%;
    border-radius: 0.25rem;
    transform: translate(-50%, calc(-100% - 14px));
    background-color: var(--red-500);
    color: white;
    outline: 1px solid var(--outline-color);
    z-index: 1;
  }

  [aria-disabled="true"]:is(:focus, :hover)::before {
    display: flex;
    opacity: 1;

    @starting-style {
      opacity: 0;
    }
  }

  div {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    gap: 2px;
    padding: 4px;
    border-radius: 0.25rem;
    height: 2.25rem;
    padding: 0.5rem;
    margin-block: 0.5rem;
    margin-inline: 1px;
    background-color: var(--border-light);
    outline: 1px solid var(--border-xheavy);
  }

  div::before {
    content: " ";
    position: absolute;
    width: calc(50% - 0.25rem);
    top: 50%;
    height: 75%;
    transform: translateY(-50%);
    transition: left 100ms ease-in-out;
    border-radius: 0.25rem;
    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.1);
    outline: 1px solid var(--text-quaternary);
    background-color: light-dark(white, black);
    z-index: 0;
    left: 0.25rem;
  }

  div.nextgpt::before {
    left: 50%;
  }

  button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    color: var(--text-secondary);
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  button.active {
    color: var(--text-primary);
  }
</style>
