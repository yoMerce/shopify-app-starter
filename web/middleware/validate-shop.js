//@ts-check
import { v4 as uuidv4 } from "uuid";
import { Collections } from "../db";

async function createShop(db, shop) {
  const collection = db.collection(Collections.Shops);

  const doc = {
    _id: uuidv4(),
    shop,
    isActive: false,
    createdOn: new Date(new Date().toISOString()),
    modifiedOn: new Date(new Date().toISOString()),
  };

  const res = await collection.insertOne(doc);

  return res.acknowledged;
}

async function validateShop(req, res, next) {
  const shop = req.query.shop;
  const { logger, db } = req;

  try {
    // move ahead if shop is not provided in the query param
    if (!shop) {
      return next();
    }

    const collection = db.collection(Collections.Shops);

    const doc = await collection.findOne({ shop });

    if (!doc) {
      const ack = await createShop(db, shop.toString());

      if (ack === false) {
        throw new Error("Something went wrong while creating the shop");
      }

      res.redirect(`/api/auth?shop=${shop}`);
      return;
    }

    if (doc && doc.isActive === false) {
      res.redirect(`/api/auth?shop=${shop}`);
      return;
    }

    req.shopInfo = doc;
    next();
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      shop,
    });

    next({
      message: err.message,
      shop,
    });
  }
}

export default validateShop;
