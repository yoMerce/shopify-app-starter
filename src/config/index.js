const config = Object.freeze({
  "shopify": {
    "apiKey": process.env.SHOPIFY_API_KEY,
    "secret": process.env.SHOPIFY_API_SECRET,
    "scopes": ""
  },
  "server": {
    "port": 8050
  },
  "env": process.env.NODE_ENV
});

module.exports = config;
