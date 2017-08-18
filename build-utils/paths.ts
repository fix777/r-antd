import * as path from "path";
import * as fs from "fs";

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

const paths = {
  build: resolveApp("build"),
  lib: resolveApp("lib"),
  components: resolveApp("components"),
  siteIndex: resolveApp("site/index.tsx"),
};

export default paths;
