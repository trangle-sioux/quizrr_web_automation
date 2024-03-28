import {
  MongoClient,
  type Collection,
  type Db,
  type FindOptions,
} from 'mongodb';
import { environment as ENV } from './environment.util';

const client: MongoClient = new MongoClient(ENV.DB_CONNECTION_STRING);

export async function findLastAndMatchedDocument(
  databaseName: string,
  collectionName: string,
  query: Record<string, unknown>,
) {
  try {
    // Get the database and collection on which to run the operation
    const database: Db = client.db(databaseName);
    const coll: Collection = database.collection(collectionName);
    const options: FindOptions = {
      // Sort matched documents in descending order by rating
      sort: { _id: -1 },
    };
    const results = await coll.findOne(query, options);
    return results;
  } catch (e) {
    await client.close();
  }
}
