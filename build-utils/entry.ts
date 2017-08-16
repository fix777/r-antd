import * as dirTree from "directory-tree";
import * as path from "path";

import paths from "./paths";

const { children } = dirTree(paths.components);

const loop = (src: any[] = [], parentPath = "components", entry: any[] = []) => {
  src.forEach(s => {
    if (s.type === "directory" && Array.isArray(s.children) && !!s.children.length) return [...entry, ...loop(s.children, path.join(parentPath, s.name), entry)];
    const e = Object.assign({}, s, {
      entryName: path.join(parentPath, String(s.name).replace(/.tsx/, ".js")),
    });
    entry.push(e);
  });
  return entry;
}

const reduce = (src: any[] = []) => src.reduce(
  (entryObj, curEntry) => {
    entryObj[curEntry.entryName] = curEntry.path;
    return entryObj;
  },
  {}
);

const entry = reduce(loop(children));

export default entry;
