const ngrok = require("ngrok");

const configureApp = require("./app");
const Config = require("../config");

console.log(Config);

async function start() {
  const app = await configureApp();
  app.listen(Config.server.port);

  if(Config.env !== "local") {
    await ngrok.connect(Config.server.port);
    const apiUrl = ngrok.getUrl();
    console.log(apiUrl);
  }
}

start();