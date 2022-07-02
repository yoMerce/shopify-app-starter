import { MongoClient } from "mongodb";
import Config from "../config";

let dbDriver;

const client = new MongoClient(Config.DB.connectionString);

async function connect() {
  try {
    await client.connect();
    dbDriver = client.db(Config.DB.name);
  } catch (err) {
    await client.close();
    throw err;
  }
}

export async function close() {
  await client.close();
}

export async function DbMiddleware(req, res, next) {
  try {
    if (!dbDriver) {
      await connect();
    }

    req.db = dbDriver;
    next();
  } catch (err) {
    req.logger.error({
      message: "There was an error while connecting to database",
      error: err,
    });
    next(err);
  }
}

export async function getDbDriver() {
  if (!dbDriver) {
    await connect();
  }

  return dbDriver;
}

export * from "./enums";
