<script>
  import { SetupIndicatorIcon } from "../../icons";
  import { progressIndicator } from "../../stores";
</script>

<div class="main-container">
  <div class="popup-container">
    <div class="icon-container">
      <SetupIndicatorIcon style="width: 10vi; height: auto;" />
    </div>
  </div>
  <div class="progress-indicator">
    <progress max="500" value={$progressIndicator}>{$progressIndicator}%</progress>
  </div>
</div>

<style>
  * {
    outline: 1px solid red;
  }

  .progress-indicator {
    left: 20%;
    top: 20%;
    height: 100px;
    min-width: 30%;
    padding-inline: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 3;
  }

  .icon-container {
    display: flex;
    flex-grow: 1;
    justify-self: stretch;
    align-self: stretch;
    justify-content: center;
    align-items: center;
  }

  .main-container {
    position: fixed;

    height: 100dvh;
    width: 100dvw;

    inset: 0;

    backdrop-filter: blur(4px);
    z-index: 10;
  }

  .popup-container {
    overflow: hidden;
    display: flex;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45dvw;
    height: 55dvh;
    background: linear-gradient(45deg, var(--main-surface-primary), var(--main-surface-tertiary));
    border-radius: 25px;
    outline: 1px solid var(--border-xheavy);
    z-index: 0;
  }
</style>
