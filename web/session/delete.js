//@ts-check

import { Collections, getDbDriver } from "../db";

async function deleteSession(id) {
  const db = await getDbDriver();

  const collection = db.collection(Collections.Sessions);

  const res = await collection.deleteOne({ _id: id });

  if (res.acknowledged === true) {
    return true;
  }

  return false;
}

export default deleteSession;
