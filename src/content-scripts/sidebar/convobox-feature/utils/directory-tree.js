/**
 * @typedef {Object} Item
 * @property {string} title
 * @property {import('../../../../types.d').DataItemType} data
 * @property {"item"} type
 */

/**
 * @typedef {Object} FolderType
 * @property {string} id
 * @property {string} title
 * @property {"folder"} type
 * @property {Array<FolderTyep | Item>} children
 * @property {string | number} create_time
 * @property {string | number} update_time
 */

/**
 * @typedef {Object} DTreeType
 * @property {FolderType[]} folders
 * @property {Array<Item>} items
 */

import { writable } from "svelte/store";

export function DirectoryTree(data) {
  /**@type {DTreeType} */
  const DTree = {
    conversations: [],
    folders: [],
    items: structuredClone(data.conversations),
  };

  if (true) Object.assign(DTree, { gizmos: data.gizmos });

  for (const folder of data.folders) {
    const tmp = {
      ...folder,
      children: [],
    };

    for (const child of folder.children) {
      switch (child.type) {
        case "folder":
          console.log("folder handling not implemented yet!");
          break;
        case "convo":
          const tempIndex = data.conversations.findIndex((item) => item.id === child.id);

          if (tempIndex === -1) {
            console.log({ convo: child, error: "convo not found!" });
            continue;
          }

          tmp.children.push(...data.conversations.splice(tempIndex, 1));
          break;
      }
    }

    DTree.folders.push(tmp);
  }

  DTree.conversations.push(...data.conversations.map((item) => ({ ...item, type: "item" })));

  const { subscribe, update } = writable(DTree);

  document.addEventListener("dbUPDATE", (/**@type {DBCustomEvent}*/ e) => {
    update((curr) => {
      const { args, name } = e.detail;
      for (const arg of args) {
        switch (name) {
          case "conversations":
            const co_idx = curr.conversations.findIndex((item) => item.id === arg.id);
            if (co_idx === -1) {
              curr.conversations.push(arg);
            } else {
              curr.conversations[co_idx] = Object.assign(curr.conversations[co_idx], arg);
            }
            break;

          case "folders":
            const fo_idx = curr.folders.findIndex((item) => item.id === arg.id);

            if (fo_idx !== -1) {
              curr.conversations.push(...curr.folders[fo_idx].children);
              const tmpFolder = { ...arg, children: [] };

              for (const child of arg.children) {
                switch (child.type) {
                  case "folder":
                    console.log("folder handling not implemented yet!");
                    break;

                  case "convo":
                    let tempIndex = curr.conversations.findIndex((item) => item.id === child.id);
                    if (tempIndex === -1) {
                      console.log({ convo: child, error: "convo not found!" });
                      continue;
                    }
                    tmpFolder.children.push(...curr.conversations.splice(tempIndex, 1));
                    break;
                }
              }

              curr.folders[fo_idx] = tmpFolder;
            } else {
              const tmpFolder = { ...arg, children: [] };

              for (const child of arg.children) {
                switch (child.type) {
                  case "folder":
                    console.log("folder handling not implemented yet!");
                    break;

                  case "convo":
                    let tempIndex = curr.conversations.findIndex((item) => item.id === child.id);
                    if (tempIndex === -1) {
                      console.log({ convo: child, error: "convo not found!" });
                      continue;
                    }
                    tmpFolder.children.push(...curr.conversations.splice(tempIndex, 1));
                    break;
                }
              }

              curr.folders.push(tmpFolder);
            }
            break;
        }
      }

      return curr;
    });
  });

  document.addEventListener("dbDELETE", (/**@type {DBCustomEvent}*/ e) => {
    update((curr) => {
      const { name, args } = e.detail;
      for (const arg of args) {
        switch (name) {
          case "conversations":
            const co_idx = curr.conversations.findIndex((item) => item.id === arg);
            if (co_idx !== -1) curr.conversations.splice(co_idx, 1);
            else {
              for (const folder of curr.folders) {
                const fo_idx = folder.children.findIndex((item) => item.id === arg);
                if (fo_idx !== -1) {
                  folder.children.splice(fo_idx, 1);
                  break;
                }
              }
            }

            break;
        }
      }

      return curr;
    });
  });

  return {
    subscribe,
  };
}
