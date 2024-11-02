window.history.pushState = new Proxy(window.history.pushState, {
  apply: (target, thisArg, args) => {
    const navigateToLocation = args[2];
    const currentLocation = window.location.pathname;
    document.dispatchEvent(new CustomEvent("onNavigate", { detail: { navigateToLocation, currentLocation } }));
    document.dispatchEvent(new CustomEvent("onURLChange", { detail: { url: navigateToLocation } }));
    return Reflect.apply(target, thisArg, args);
  },
});

window.fetch = new Proxy(window.fetch, {
  apply: async (target, thisArg, args) => {
    const url = new URL(args[0]);
    const res = await Reflect.apply(target, thisArg, args);

    switch (args[1].method) {
      case "POST":
        const postDetail = { url: url.toString(), body: args[1].body };
        document.dispatchEvent(new CustomEvent("onPOST", { detail: postDetail }));
        break;
      case "PATCH":
        const patchDetail = { url: url.toString(), options: args[1], ok: res.ok };
        document.dispatchEvent(new CustomEvent("onPATCH", { detail: patchDetail }));
        break;
      case "GET":
        if (hasConvoId(args[0]))
          document.dispatchEvent(new CustomEvent("onGET", { detail: { action: "save-as-btn" } }));
    }

    return res;
  },
});

/**
 * @param {string | URL} url
 * @returns {Boolean}
 */
function hasConvoId(url) {
  return !!url
    .toString()
    .match(/[a-fA-F0-9-]{36}/)
    ?.at(0);
}

// // const [url, options] = args;
// // const { method, headers } = options;
// // const { pathname, searchParams, origin } = new URL(url);
//
// // if (method === "GET") {
// //   if (searchParams.get("secret") === "MjAyMy0wNy0yNFQxNjo0OToxMC4wMDBa") {
// //     const { items } = await res.json();
// //     if (searchParams.get("is_archived") === "true") {
// //       desyncDB("convo-db", "convo-store", items);
// //       syncDB("convo-db", "archived-convo-store", items);
// //       return;
// //     }
//
// //     desyncDB("convo-db", "archived-convo-store", items);
// //     syncDB("convo-db", "convo-store", items);
// //     return;
// //   }
//
// //   return res;
// // }

// if (pathname.startsWith("/backend-api/conversation")) {
//   const searchObj = {
//     limit: "5",
//     offset: "0",
//     order: "updated",
//     secret: "MjAyMy0wNy0yNFQxNjo0OToxMC4wMDBa",
//     is_archived: false,
//   };

//   if (method === "PATCH") {
//     if (options.body) {
//       const body = JSON.parse(options.body);
//       Object.assign(searchObj, body);
//       console.log(searchObj);
//     }
//   }

//   const urlSearchParams = new URLSearchParams(searchObj);

//   await fetch(`${origin}/backend-api/conversations?${urlSearchParams.toString()}`, {
//     headers,
//     method: "GET",
//   });
// }

// function syncDB(dbName, storeName, data) {
//   const db = indexedDB.open(dbName, 1);

//   db.onsuccess = function (e) {
//     const db = e.target.result;
//     const tx = db.transaction(storeName, "readwrite");
//     const store = tx.objectStore(storeName);

//     data.forEach((convo) =>
//       store.put({
//         id: convo.id,
//         title: convo.title,
//         create_time: convo.create_time,
//         update_time: convo.update_time,
//       })
//     );
//   };

//   db.onerror = function (e) {
//     console.error(e);
//   };
// }

// function desyncDB(dbName, storeName, data) {
//   const db = indexedDB.open(dbName, 1);

//   db.onsuccess = function (e) {
//     /**@type {IDBDatabase} */
//     const db = e.target.result;
//     const tx = db.transaction(storeName, "readwrite");
//     const store = tx.objectStore(storeName);

//     data.forEach((convo) => store.delete(convo.id));
//   };

//   db.onerror = function (e) {
//     console.error(e);
//   };
// }
