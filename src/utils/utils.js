export function polyfillFindLast() {
  Array.prototype.findLast = function (callback) {
    return this.reverse().find(callback);
  };
}

export const HTMLParserSingleton = (() => {
  let parserInstance;

  class HTMLParser {
    constructor() {
      if (!parserInstance) {
        parserInstance = new DOMParser();
      }
      return parserInstance;
    }

    static parseHTML(htmlString) {
      return parserInstance.parseFromString(htmlString, "text/html").body.firstElementChild;
    }
  }

  return HTMLParser;
})();
