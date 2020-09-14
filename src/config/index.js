const config = Object.freeze({
  "shopify": {
    "apiKey": process.env.SHOPIFY_API_KEY,
    "secret": process.env.SHOPIFY_API_SECRET,
    "scopes": "",
    "cookieKey": "shopOrigin"
  },
  "server": {
    "port": 8050
  },
  "env": process.env.NODE_ENV
});

module.exports = config;
