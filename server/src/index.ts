import app, { logger } from "./app";
import Config from "./config";

app.listen(Config.API.port, () => {
  logger.info(`Running on ${Config.API.port}`);
});
