import webpack from "webpack";
import * as webpackMerge from "webpack-merge";

import commonConfig from "./build-utils/webpack.config.common";

const getWebpackConfig = (env: any): webpack.Configuration => {
  const envConfig = require(`./build-utils/webpack.config.${env.env}.ts`).default;
  const mergedConfig = webpackMerge(commonConfig, envConfig);
  return mergedConfig;
};

export default getWebpackConfig;
