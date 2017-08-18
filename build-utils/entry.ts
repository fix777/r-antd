import * as dirTree from "directory-tree";
import * as path from "path";

import paths from "./paths";

const { children } = dirTree(paths.components);

const loop = (src: any[] = [], parentPath = "components", entries: any[] = []) => {
  src.forEach(s => {
    if (s.type === "directory" && Array.isArray(s.children) && !!s.children.length) {
      return [...entries, ...loop(s.children, path.join(parentPath, s.name), entries)];
    }

    if (s.type === "file" && !/\.tsx?/.test(s.name)) return;

    const name =
      String(s.name)
        .replace(/\.tsx/, ".js");
        // .replace(/\.less/, ".css");

    const e = Object.assign({}, s, {
      entryName: path.join(parentPath, name),
    });
    entries.push(e);
  });
  return entries;
};

const reduce = (src: any[] = []) => src.reduce(
  (entryObj, curEntry) => {
    entryObj[curEntry.entryName] = curEntry.path;
    return entryObj;
  },
  {}
);

const entry = reduce(loop(children));

export default entry;
