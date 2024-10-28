export default () => {
  document.dispatchEvent(new CustomEvent("injectSidebarScript"));
};
