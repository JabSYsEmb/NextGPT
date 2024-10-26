window.history.pushState = new Proxy(window.history.pushState, {
  apply: (target, thisArg, args) => {
    document.dispatchEvent(new CustomEvent("onNavigate", { detail: { url: args[2] } }));
    return Reflect.apply(target, thisArg, args);
  },
});

window.fetch = new Proxy(window.fetch, {
  apply: async (target, thisArg, args) => {
    const [url, options] = args;
    const { method, headers } = options;
    const { pathname, searchParams, origin } = new URL(url);

    const res = await Reflect.apply(target, thisArg, args);

    if (method === "GET") {
      if (searchParams.get("secret") === "MjAyMy0wNy0yNFQxNjo0OToxMC4wMDBa") {
        const { items } = await res.json();
        if (searchParams.get("is_archived") === "true") {
          desyncDB("convo-db", "convo-store", items);
          syncDB("convo-db", "archived-convo-store", items);
          return;
        }

        desyncDB("convo-db", "archived-convo-store", items);
        syncDB("convo-db", "convo-store", items);
        return;
      }

      return res;
    }

    if (pathname.startsWith("/backend-api/conversation")) {
      const searchObj = {
        limit: "5",
        offset: "0",
        order: "updated",
        secret: "MjAyMy0wNy0yNFQxNjo0OToxMC4wMDBa",
        is_archived: false,
      };

      if (method === "PATCH") {
        if (options.body) {
          const body = JSON.parse(options.body);
          Object.assign(searchObj, body);
          console.log(searchObj);
        }
      }

      const urlSearchParams = new URLSearchParams(searchObj);

      await fetch(`${origin}/backend-api/conversations?${urlSearchParams.toString()}`, {
        headers,
        method: "GET",
      });
    }

    return res;
  },
});

function syncDB(dbName, storeName, data) {
  const db = indexedDB.open(dbName, 1);

  db.onsuccess = function (e) {
    const db = e.target.result;
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    data.forEach((convo) =>
      store.put({
        id: convo.id,
        title: convo.title,
        create_time: convo.create_time,
        update_time: convo.update_time,
      })
    );
  };

  db.onerror = function (e) {
    console.error(e);
  };
}

function desyncDB(dbName, storeName, data) {
  const db = indexedDB.open(dbName, 1);

  db.onsuccess = function (e) {
    /**@type {IDBDatabase} */
    const db = e.target.result;
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    data.forEach((convo) => store.delete(convo.id));
  };

  db.onerror = function (e) {
    console.error(e);
  };
}
