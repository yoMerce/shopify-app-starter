const config = Object.freeze({
  "shopify": {
    "apiKey": process.env.SHOPIFY_API_KEY
  },
  "server": {
    "port": 8050
  },
  "env": process.env.NODE_ENV
});

module.exports = config;
