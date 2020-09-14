const Config = require("./config");
const withCSS = require("@zeit/next-css");

const webpack = require("webpack");

module.exports = withCSS({
  webpack: config => {
    const env = {
      API_KEY: Config.shopify.apiKey,
      COOKIE_KEY: Config.shopify.cookieKey
    };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  }
});
