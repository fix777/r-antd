const dirTree = require("directory-tree");
const path = require("path");

const tree = dirTree(path.resolve(__dirname, "..", "components"));

const loop = (src = [], parentPath = "components", entry = []) => {
  src.forEach(s => {
    if (s.type === "directory" && Array.isArray(s.children) && !!s.children.length) return [...entry, ...loop(s.children, s.name, entry)];
    const e = Object.assign({}, s, {
      entryName: path.resolve(parentPath, String(s.name).replace(/.tsx/, ".js")),
    });
    entry.push(e);
  });
  return entry;
}

const reduce = (src = []) => src.reduce(
  (entryObj, curEntry) => {
    entryObj[curEntry.entryName] = curEntry.path;
    return entryObj;
  },
  {}
);

const entry = reduce(loop(tree.children));

console.log(entry);
