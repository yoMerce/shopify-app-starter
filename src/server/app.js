require("isomorphic-fetch");

const next = require("next");
const Koa = require("koa");
const Router = require("@koa/router");
const session = require("koa-session");
// const graphQLProxy, {ApiVersion} = require("@shopify/koa-shopify-graphql-proxy");

const config = require("../config");

const dev = config.env !== "production";

const app = next({dev});
const handler = app.getRequestHandler();

function configureApp() {
  return app.prepare()
    .then(() => {
      const server = new Koa();
      const router = new Router();
    
      router.get("(.*)", async (ctx) => {
        await handler(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.status = 200;
      });
    
      server.use(router.allowedMethods());
      server.use(router.routes());
    
      return server;
    }).catch(error => {
      console.log(error);
      return;
    });
}

module.exports = configureApp;
