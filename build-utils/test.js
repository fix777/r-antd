const dirTree = require("directory-tree");
const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const tree = dirTree(path.resolve(__dirname, "..", "components"));

const loop = (src = [], parentPath = "components", entry = []) => {
  src.forEach(s => {
    if (s.type === "directory" && Array.isArray(s.children) && !!s.children.length) {
      return [...entry, ...loop(s.children, path.join(parentPath, s.name), entry)];
    }

    if (s.type === "file" && !/\.tsx?/.test(s.name)) return;

    const name =
      String(s.name)
        .replace(/\.tsx/, ".js")
        .replace(/\.less/, ".css");

    const e = Object.assign({}, s, {
      entryName: path.join(parentPath, name),
    });

    entry.push(e);
  });
  return entry;
};

const reduce = (src = []) => src.reduce(
  (entryObj, curEntry) => {
    entryObj[curEntry.entryName] = curEntry.path;
    return entryObj;
  },
  {}
);

const entry = reduce(loop(tree.children));

const loopStyleDirs = (src = [], parentPath = "components", styleDirs = []) => {
  src.forEach(s => {
    if (s.type !== "directory") return;
    if (!/style/.test(s.name) && Array.isArray(s.children) && !!s.children.length) {
      return [...styleDirs, ...loopStyleDirs(s.children, path.join(parentPath, s.name), styleDirs)];
    }

    // const styleDir = Object.assign({}, s, {
    //   styleDirPath: path.join(parentPath, s.name)
    // });

    styleDirs.push(path.join(parentPath, s.name));
  });
  return styleDirs;
};

const styleDirs = loopStyleDirs(tree.children);

styleDirs.forEach(styleDir => {
  const ws = fs.createWriteStream(resolveApp(path.join("lib", styleDir, "css.js")));
  ws.once("open", () => {
    ws.write('import "./index.css";');
    ws.end();
  });
});

console.log(styleDirs);
