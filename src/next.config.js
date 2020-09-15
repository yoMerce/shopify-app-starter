const Config = require("./config");
const withCSS = require("@zeit/next-css");

const webpack = require("webpack");

module.exports = withCSS({
  webpack: config => {
    return config;
  }
});
