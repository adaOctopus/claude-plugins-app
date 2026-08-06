import mongoose from "mongoose";
import { getMongoConfig } from "@/lib/mongo-config";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const { uri, dbName } = getMongoConfig();

    cached.promise = mongoose
      .connect(uri, { dbName, bufferCommands: false })
      .then((conn) => {
        cached.conn = conn;
        return conn;
      })
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        throw err;
      });
  }

  return cached.promise;
}

/** Active database name (for logging / scripts). */
export function getConnectedDatabaseName(): string {
  return mongoose.connection.name || getMongoConfig().dbName;
}
