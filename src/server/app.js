require("isomorphic-fetch");

const next = require("next");
const Koa = require("koa");
const Router = require("@koa/router");
const session = require("koa-session");
const {"default": graphQLProxy, ApiVersion} = require("@shopify/koa-shopify-graphql-proxy");

const Config = require("../config");
const {setupAuth, mwVerifyRequest} = require("./middlewares");

const dev = Config.env !== "production";

const app = next({dev});
const handler = app.getRequestHandler();

function configureApp() {
  return app.prepare()
    .then(() => {
      const server = new Koa();
      const router = new Router();

      // Add session
      const sessionConfig = {
        sameSite: "none",
        secure: true
      };

      server.use(session(sessionConfig, server));

      // Add keys for signing cookies
      server.keys = [Config.shopify.secret];

      // middlewares
      server.use(setupAuth());

      // Add Graphql Proxy for shopify
      server.use(graphQLProxy({
        version: ApiVersion.January20
      }));
    
      router.get("(.*)", mwVerifyRequest, async (ctx) => {
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
