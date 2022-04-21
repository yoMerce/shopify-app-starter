import app from "./app";
import Config from "./config";

app.listen(Config.API.port, () => {
  // console.log(`Running on ${Config.API.port}`);
});
