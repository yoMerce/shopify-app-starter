import { Logger } from "@s25digital/express-mw-logger";
import { Db } from "mongodb";
import { Collections } from "../../db";

function getHandler(db: Db, logger: typeof Logger) {
  return async (topic: string, shop: string, body: string) => {
    logger.debug({
      message: `processiong webhook for ${topic}`,
      topic,
      shop,
      body,
    });

    const collection = db.collection(Collections.Shops);

    await collection.findOneAndUpdate(
      {
        shop,
      },
      {
        $set: {
          isActive: false,
          modifiedOn: new Date(new Date().toISOString()),
          uninstalledOn: new Date(new Date().toISOString()),
        },
      }
    );
  };
}

export default getHandler;
