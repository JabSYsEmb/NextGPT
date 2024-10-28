export default (customEventName) => {
  document.dispatchEvent(new CustomEvent(customEventName));
};
