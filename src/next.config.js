const Config = require("./config");
const withCSS = require("@zeit/next-css");

const webpack = require("webpack");

module.exports = withCSS({
  webpack: config => {
    const env = {
      NEXT_PUBLIC_API_KEY: Config.shopify.apiKey,
      NEXT_PUBLIC_COOKIE_KEY: Config.shopify.cookieKey,
      NEXT_PUBLIC_ENV: Config.env || "local"
    };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  }
});
