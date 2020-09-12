const configureApp = require("./app");

async function start() {
  const app = await configureApp();

  app.listen(8000);
}

start();