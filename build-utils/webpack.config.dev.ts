import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as HtmlWebpackTemplate from "html-webpack-template";

import paths from "./paths";
// import entry from "./entry";

const commonConfig: webpack.Configuration = {
  entry: [paths.siteIndex],
  resolve: {
    extensions: [],
  },
  output: {
    path: paths.build,
    publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    // hot: true,
    port: 7777,
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: HtmlWebpackTemplate,
      appMountId: "react-root",
    }),
  ]
};

export default commonConfig;
