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

/**
 * @param {import('../../../../types.d').DBObjectSvelte} data
 * @returns
 */
export function DirectoryTree(data) {
  const { folders, conversations } = data;
  console.log({ folders: folders.length, conversations: conversations.length });

  /**@type {DTreeType} */
  const DTree = {
    folders: [],
    items: [],
  };

  if (true) Object.assign(DTree, { gizmos: [] });

  for (const folder of folders) {
    const tmp = {
      ...folder,
      children: [],
    };

    for (const child of folder.children) {
      switch (child.type) {
        case "folder":
          console.log("folder handling not implemented yet!");
          break;
        case "item":
          const tempIndex = conversations.findIndex((item) => item.id === child.id);

          if (tempIndex === -1) {
            console.log({ ...child, error: "item not found!" });
            continue;
          }

          tmp.children.push(...conversations.splice(tempIndex, 1));
          break;
      }
    }

    DTree.folders.push(tmp);
  }

  if (true) {
    const archive = [];

    conversations.forEach((convo, id) => {
      if (convo.is_archived) {
        archive.push({ ...convo, type: "item" });
        conversations.splice(id, 1);
      }
    });

    Object.assign(DTree, { archive });
  }

  DTree.items.push(...conversations.map((item) => ({ ...item, type: "item" })));

  function getTree() {
    return DTree;
  }

  function getItems() {
    return conversations;
  }

  function getFolders() {
    return folders;
  }

  function getItemsInFolder(folder_id) {}
  function getFoldersInFolder(folder_id) {}

  function insertFolder(folder_name, parent_id) {}
  function insertItemInFolder(item_id, folder_id) {}

  function deleteDirectory(director_id) {}
  function deleteItem(item_id) {}

  return {
    getTree,
    getItems,
    getFolders,
  };
}
