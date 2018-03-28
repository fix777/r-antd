#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const siteDir = path.resolve(__dirname, "../_site");
if (!fs.existsSync(siteDir)) {
  fs.mkdirSync(siteDir);
}
const srcAntdCssPath = path.resolve(__dirname, "./../node_modules/antd/dist/antd.css");
const desAntdCssPath = path.resolve(__dirname, "../_site/antd.css");
fs.copyFileSync(srcAntdCssPath, desAntdCssPath);
