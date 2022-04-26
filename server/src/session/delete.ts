import { Collections, getDbDriver } from "../db";

async function deleteSession(id: string) {
  const db = await getDbDriver();

  const collection = db.collection(Collections.Sessions);

  const res = await collection.deleteOne({ id });

  if (res.acknowledged === true) {
    return true;
  }

  return false;
}

export default deleteSession;
