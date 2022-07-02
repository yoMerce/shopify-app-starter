//@ts-check
import Cryptr from "cryptr";
import Config from "../config";
import { Collections, getDbDriver } from "../db";

const cipher = new Cryptr(Config.DB.encryptionKey);

async function store(session) {
  const db = await getDbDriver();

  const collection = db.collection(Collections.Sessions);

  const doc = {
    shop: session.shop,
    data: cipher.encrypt(JSON.stringify(session)),
  };

  const res = await collection.findOneAndReplace({ _id: session.id }, doc, {
    returnDocument: "after",
    upsert: true,
  });

  if (res.ok === 1) {
    return true;
  }

  return false;
}

export default store;
