//@ts-check

import { Collections } from "../../db";

function getHandler(db, logger) {
  return async (topic, shop, body) => {
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
