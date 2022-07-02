//@ts-check

import { v4 as uuidv4 } from "uuid";
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
    const sessionCollection = db.collection(Collections.Sessions);
    const shopAuditCollection = db.collection(Collections.ShopAudit);

    const res = await collection.findOneAndUpdate(
      {
        shop,
      },
      {
        $set: {
          isActive: false,
          modifiedOn: new Date(new Date().toISOString()),
          uninstalledOn: new Date(new Date().toISOString()),
        },
      }, {
        returnDocument: "after"
      }
    );

    await sessionCollection.deleteMany({ shop });

    const auditObj = res.value;
    auditObj.shopId = auditObj._id;
    auditObj._id = uuidv4();
    await shopAuditCollection.insertOne(auditObj);
  };
}

export default getHandler;
