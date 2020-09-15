const {"default": createShopifyAuth} = require("@shopify/koa-shopify-auth");

const Config = require("../../config");

async function afterAuth(ctx) {
  const {shop} = ctx.session;

  // save the details of the shop in db for future reference

  // register webhooks if required

  ctx.cookies.set(Config.shopify.cookieKey, shop, {
    "httpOnly": false,
    "secure": true,
    "sameSite": "none"
  });

  // redirect to root page or anywhere based on your defined logic
  ctx.redirect("/");
}

function setupAuth() {
  return createShopifyAuth({
    "apiKey": Config.shopify.apiKey,
    "secret": Config.shopify.secret,
    "scopes": [Config.shopify.scopes],
    afterAuth
  });
}

module.exports = setupAuth;
