import { IGDPR } from "@interfaces";
import { Logger } from "@s25digital/express-mw-logger";
import { Db } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { Collections } from "../../db";

async function getHandler(db: Db, logger: typeof Logger) {
  return async (topic: string, shop: string, body: string) => {
    logger.debug({
      message: `processiong webhook for ${topic}`,
      topic,
      shop,
      body,
    });

    const collection = db.collection<IGDPR>(Collections.GDPR);

    await collection.insertOne({
      _id: uuidv4(),
      data: JSON.parse(body),
      topic,
      shop,
    });
  };
}

export default getHandler;
