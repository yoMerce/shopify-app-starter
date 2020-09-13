const Config = require("./config");
const withCSS = require("@zeit/next-css");

const webpack = require("webpack");
const apiKey = JSON.stringify(Config.shopify.apiKey);

module.exports = withCSS({
  webpack: config => {
    const env = { API_KEY: apiKey };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  }
});
