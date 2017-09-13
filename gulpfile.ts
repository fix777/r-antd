import * as gulp from "gulp";
import * as dirTree from "directory-tree";
import * as path from "path";
import * as fs from "fs";
import * as ts from "gulp-typescript";
import * as merge from "merge2";
import * as babel from "gulp-babel";
import * as less from "gulp-less";

import paths, { resolveApp } from "./build-utils/paths";

const tsProject = ts.createProject("tsconfig.json");

const loopStyleDirs = (
  src: any[] = [],
  parentPath = "",
  styleDirs: any[] = []
) => {
  src.forEach(s => {
    if (s.type !== "directory") return;
    if (
      !/style/.test(s.name) &&
      Array.isArray(s.children) &&
      !!s.children.length
    ) {
      return [
        ...styleDirs,
        ...loopStyleDirs(s.children, path.join(parentPath, s.name), styleDirs),
      ];
    }

    // const styleDir = Object.assign({}, s, {
    //   styleDirPath: path.join(parentPath, s.name)
    // });

    styleDirs.push(path.join(parentPath, s.name));
  });
  return styleDirs;
};

gulp.task("es", () => {
  const tsResult = gulp.src("components/**/*.tsx").pipe(tsProject());
  return merge([
    tsResult.dts.pipe(gulp.dest("es")),
    tsResult.js.pipe(
      gulp.dest((file: any) => {
        file.extname = ".js";
        return "es";
      })
    ),
  ]);
});

gulp.task("addCssjs", ["es"], () => {
  const { children } = dirTree(paths.es);
  const stylePaths = loopStyleDirs(children);
  stylePaths.forEach(styleDir => {
    const ws = fs.createWriteStream(
      resolveApp(path.join("es", styleDir, "css.js"))
    );
    ws.once("open", () => {
      ws.write('import "./index.css";');
      ws.end();
    });
  });
});

gulp.task("less", ["addCssjs"], () => {
  gulp
    .src("components/**/*.less")
    .pipe(less())
    .pipe(gulp.dest("es"));
});

gulp.task("babelify", ["less"], () => {
  gulp
    .src("es/**/*.{js,jsx}")
    .pipe(babel())
    .pipe(gulp.dest("lib"));
});

gulp.task("dts", ["babelify"], () => {
  gulp.src("es/**/*.d.ts").pipe(gulp.dest("lib"));
});

gulp.task("css", ["dts"], () => {
  gulp.src("es/**/style/**/*.css").pipe(gulp.dest("lib"));
});

gulp.task("css2", () => {
  gulp.src("es/**/style/**/*.css").pipe(gulp.dest("lib"));
});

gulp.task("default", ["css"], () => {
  // tslint:disable-next-line:no-console
  console.log("build is done.");
});
