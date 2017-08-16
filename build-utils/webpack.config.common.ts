import * as webpack from "webpack";

const commonConfig: webpack.Configuration = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".less", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [
          require.resolve("babel-loader"),
          require.resolve("ts-loader"),
        ],
      },
      {
        test: /.css$/,
        use: [
          require.resolve("style-loader"),
          require.resolve("css-loader"),
        ],
      },
    ],
  },
};

export default commonConfig;
