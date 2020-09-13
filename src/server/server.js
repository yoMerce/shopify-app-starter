const ngrok = require("ngrok");

const configureApp = require("./app");
const Config = require("../config");

async function start() {
  const app = await configureApp();
  app.listen(Config.server.port);

  await ngrok.connect(Config.server.port);

  const apiUrl = ngrok.getUrl();

  console.log(apiUrl);
}

start();