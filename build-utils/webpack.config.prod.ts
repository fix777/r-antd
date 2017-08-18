import * as webpack from "webpack";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";

import paths from "./paths";
import entry from "./entry";

// console.log(entry);

const extractLess = new ExtractTextPlugin({
  filename: getPath => {
    return getPath("[name].css").replace(/\.js\.css/, ".css");
  },
});

const prodConfig: webpack.Configuration = {
// const prodConfig: any = {
  entry,
  output: {
    path: paths.lib,
    filename: "[name]",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: extractLess.extract({
          fallback: "style-loader",
          use: [
            require.resolve("css-loader"),
            require.resolve("less-loader"),
          ]
        }),
      },
    ],
  },
  externals: [
    "react",
    "antd",
    /^antd\/.+$/, // everything that starts with "antd/"
  ],
  plugins: [
    extractLess,
  ],
};

export default prodConfig;
