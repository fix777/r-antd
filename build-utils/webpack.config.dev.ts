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
  devtool: "cheap-module-eval-source-map",
  devServer: {
    // hot: true,
    port: 7777,
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          require.resolve("style-loader"),
          require.resolve("css-loader"),
          require.resolve("less-loader"),
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: HtmlWebpackTemplate,
      appMountId: "react-root",
      links: ["http://cdnjs.cloudflare.com/ajax/libs/antd/2.12.6/antd.min.css"],
    }),
  ],
};

export default commonConfig;
