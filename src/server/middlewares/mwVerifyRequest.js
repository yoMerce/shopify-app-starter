const {verifyRequest} = require("@shopify/koa-shopify-auth");

const Config = require("../../config");

const verify = verifyRequest();

async function mwVerifyRequest(ctx, next) {
  if (Config.env === "local") {
    return await next();
  }

  return verify(ctx, next);
}

module.exports = mwVerifyRequest;
