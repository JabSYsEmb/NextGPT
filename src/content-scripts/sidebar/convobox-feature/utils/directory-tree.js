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
    archive: [],
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

  if (true) {
    const archive = [];

    data.conversations.forEach((convo, id) => {
      if (convo.is_archived) {
        archive.push({ ...convo, type: "item" });
        data.conversations.splice(id, 1);
      }
    });

    Object.assign(DTree, { archive });
  }

  DTree.conversations.push(...data.conversations.map((item) => ({ ...item, type: "item" })));

  function findItemById(id, dObj) {
    if (dObj.conversations.find((item) => item.id === id)) {
      return {
        findIn: "conversations",
      };
    }

    if (dObj.archive.find((item) => item.id === id)) {
      return {
        findIn: "archive",
      };
    }

    const folderId = dObj.folders.findIndex((folder) => folder.children.some((item) => item.id === id));

    return folderId !== -1
      ? {
          findIn: "folders",
          folderId,
        }
      : {
          findIn: "not-found",
        };
  }

  const { subscribe, update } = writable(DTree);

  document.addEventListener("dbUPDATE", (/**@type {DBCustomEvent}*/ e) => {
    update((curr) => {
      for (const arg of e.detail.args) {
        const whereToFind = findItemById(arg.id, curr);
        switch (whereToFind.findIn) {
          case "conversations":
            const co_idx = curr.conversations.findIndex((item) => item.id === arg.id);
            curr.conversations[co_idx] = Object.assign(curr.conversations[co_idx], arg);
            break;
          case "archive":
            const ar_idx = curr.archive.findIndex((item) => item.id === arg.id);
            curr.conversations[ar_idx] = Object.assign(curr.conversations[ar_idx], arg);
            break;
          case "folders":
            const fo_idx = whereToFind.folderId;
            const fo_child_idx = curr.folders[fo_idx].children.findIndex((item) => item.id === arg.id);
            curr.folders[fo_idx].children[fo_child_idx] = Object.assign(
              curr.folders[fo_idx].children[fo_child_idx],
              arg
            );
            break;
          case "not-found":
            curr.conversations.push(arg);
            break;
        }
      }

      return curr;
    });
  });

  document.addEventListener("dbDELETE", (/**@type {DBCustomEvent}*/ e) => {
    update((curr) => {
      for (const arg of e.detail.args) {
        const whereToFind = findItemById(arg, curr);
        switch (whereToFind.findIn) {
          case "conversations":
            const co_idx = curr.conversations.findIndex((item) => item.id === arg);
            curr.conversations.splice(co_idx, 1);
            break;
          case "archive":
            const ar_idx = curr.archive.findIndex((item) => item.id === arg);
            curr.archive.splice(ar_idx, 1);
            break;
          case "folders":
            const fo_idx = whereToFind.folderId;
            const fo_child_idx = curr.folders[fo_idx].children.findIndex((item) => item.id === arg);
            curr.folders[fo_idx].children[fo_child_idx] = Object.assign(
              curr.folders[fo_idx].children[fo_child_idx],
              arg
            );
            break;
          case "not-found":
            console.log({ error: "item not found!", item: arg });
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
