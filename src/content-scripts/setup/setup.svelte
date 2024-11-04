<script>
  import { SetupIndicatorIcon } from "../../icons";
</script>

<div class="main-container">
  <div class="popup-container">
    <header>....</header>
    <div class="icon-container">
      <SetupIndicatorIcon style="width: 10vi; height: auto;" />
    </div>
    <footer>!!!!</footer>
  </div>
</div>

<style>
  * {
    outline: 1px solid red;
  }

  .icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  footer {
    background-color: red;
  }

  header {
    background-color: antiquewhite;
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
    display: grid;
    grid-template-rows: 15px 1fr 10px;
    justify-items: stretch;
    align-items: stretch;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45dvw;
    height: 55dvh;
    background: linear-gradient(45deg, var(--main-surface-primary), var(--main-surface-secondary));
    border-radius: 25px;
    outline: 1px solid var(--border-xheavy);
    z-index: 0;
  }
</style>
