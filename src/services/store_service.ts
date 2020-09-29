
// This has to be here so that these filter values can be removed in the url to update the page.
// This is very hacky...
localStorage.removeItem("mtb-page");

export default {
  set: function(key:string, value: any) {
    console.debug("[cache] Setting", key);
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: function(key:string) {
    let value = localStorage.getItem(key);
    if (typeof value !== "string") {
      console.debug("[cache] Load miss from cache", key);
      return null;
    }
    console.debug("[cache] Loading from cache", key);
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  },
  remove: function(key: string) {
    console.debug("[cache] Remove from cache", key);
    localStorage.removeItem(key);
  },
 /* persistQuery: function(prefix: string, object: any) {
    let queryString = fn.queryString(object, prefix);
    let url = window.location.origin + window.location.pathname + queryString + document.location.hash;
    window.history.pushState({ path: url }, "", url);
  },
  restoreQuery: function(prefix: string, ...arrayNames: string[]) {
    let loc = document.location.search;
    let arrayPropNames = arrayNames || [];
    return fn.queryToObject(loc, arrayPropNames, prefix);
  }*/
};
