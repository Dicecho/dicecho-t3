import { MongoClient } from "mongodb";
import { env } from "@/env";

declare global {
  // eslint-disable-next-line no-var
  var mongoClient: MongoClient | undefined;
}

let client: MongoClient;

export async function getMongoClient(): Promise<MongoClient> {
  if (global.mongoClient) {
    return global.mongoClient;
  }

  client = new MongoClient(env.MONGO_URI);
  await client.connect();

  global.mongoClient = client;
  return client;
}

export async function getDatabase(dbName = "dicecho") {
  const client = await getMongoClient();
  return client.db(dbName);
}
