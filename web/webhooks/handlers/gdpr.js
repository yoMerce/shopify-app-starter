//@ts-check
import { v4 as uuidv4 } from "uuid";
import { Collections } from "../../db";

function getHandler(topic) {
  return async (req, res, next) => {
    const { logger, db, body } = req;
    logger.debug({
      message: `processiong webhook for ${topic}`,
      topic,
      body,
    });

    const collection = db.collection(Collections.GDPR);

    await collection.insertOne({
      _id: uuidv4(),
      data: JSON.parse(body),
      topic,
    });

    res.status(200).send({
      status: "recorded",
    });
    next();
  };
}

export default getHandler;
