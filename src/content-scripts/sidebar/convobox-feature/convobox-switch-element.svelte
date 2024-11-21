<script>
  /**@type {HTMLElement} */
  export let nextGPTConvoBox;
  /**@type {HTMLElement | undefined} */
  export let chatGPTConvoBox = nextGPTConvoBox.parentElement.querySelector("div:not([class])");

  const parentElement = nextGPTConvoBox?.parentElement;

  function switchConvoBox(switchToChatGPTView) {
    if (!chatGPTConvoBox) chatGPTConvoBox = parentElement.querySelector("div:not([class])");

    switchToChatGPTView ? switchToChatGPT() : switchToNextGPT();
  }

  function switchToChatGPT() {
    if (isChatGPTConvoView || !chatGPTConvoBox) return;

    chatGPTConvoBox.classList.remove("hidden");
    nextGPTConvoBox.classList.add("hidden");

    isChatGPTConvoView = true;
  }

  function switchToNextGPT() {
    if (!isChatGPTConvoView) return;

    nextGPTConvoBox.classList.remove("hidden");
    if (chatGPTConvoBox) chatGPTConvoBox.classList.add("hidden");

    isChatGPTConvoView = false;
  }

  function useSwitch() {
    if (!isSwitchEquiped) document.getElementById("nextgpt-btn").click();
  }

  const isSwitchEquiped = !!chatGPTConvoBox && !!nextGPTConvoBox;

  let isChatGPTConvoView = true;

  // complex logic
  function observeAdditionOfChatgptConvoBox() {
    if (!parentElement) return;

    new MutationObserver((mutations, observer) => {
      for (let mut of mutations) {
        if (mut.previousSibling === nextGPTConvoBox && mut.addedNodes[0]?.localName === "div") {
          chatGPTConvoBox = mut.addedNodes[0];
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
        chatGPTConvoBox = undefined;
        observer.disconnect();
      }
    }).observe(chatGPTConvoBox);
  }

  (!!chatGPTConvoBox ? observeDeletionOfChatgptConvoBox : observeAdditionOfChatgptConvoBox)();
</script>

<div class:nextgpt={!isChatGPTConvoView} use:useSwitch>
  <button id="chatgpt-btn" class:active={isChatGPTConvoView} on:click={switchConvoBox.bind(null, true)}>
    ChatGPT
  </button>
  <button id="nextgpt-btn" class:active={!isChatGPTConvoView} on:click={switchConvoBox.bind(null, false)}>
    NextGPT
  </button>
</div>

<style>
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
    background-color: var(--main-surface-primary);
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
