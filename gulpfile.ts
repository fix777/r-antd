import * as gulp from "gulp";
import * as dirTree from "directory-tree";
import * as path from "path";
import * as fs from "fs";

import paths, { resolveApp } from "./build-utils/paths";

const { children } = dirTree(paths.components);

const loopStyleDirs = (src: any[] = [], parentPath = "components", styleDirs: any[] = []) => {
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

const stylePaths = loopStyleDirs(children);

gulp.task("addCssjs", () => {
  stylePaths.forEach(styleDir => {
    const ws = fs.createWriteStream(resolveApp(path.join("lib", styleDir, "css.js")));
    ws.once("open", () => {
      ws.write('import "./index.css";');
      ws.end();
    });
  });
});
