import * as webpack from "webpack";

import paths from "./paths";
import entry from "./entry";

// console.log(entry);

const prodConfig: webpack.Configuration = {
// const prodConfig: any = {
  entry,
  output: {
    path: paths.lib,
    filename: "[name]",
    libraryTarget: "commonjs2",
  },
  externals: [
    "react",
    "antd",
    /^antd\/.+$/, // everything that starts with "antd/"
  ],
};

export default prodConfig;
