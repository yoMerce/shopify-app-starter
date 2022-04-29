import { IGDPR, IRequest } from "@interfaces";
import { NextFunction, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Collections } from "../../db";

function getHandler(topic: string) {
  return async (req: IRequest, res: Response, next: NextFunction) => {
    const { logger, db, body } = req;
    logger.debug({
      message: `processiong webhook for ${topic}`,
      topic,
      body,
    });

    const collection = db.collection<IGDPR>(Collections.GDPR);

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
