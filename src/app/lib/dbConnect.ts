import mongoose from "mongoose";
// lib/dbConnect.ts

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Check if mongoose is already defined on the global object
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  let mongoose: MongooseCache | undefined;
}

const globalWithMongooseCache = global as typeof global & {
  mongoose: MongooseCache;
};
let cached = globalWithMongooseCache.mongoose || {
  conn: null,
  promise: null,
};

if (!cached) {
  cached = globalWithMongooseCache.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Return connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // Otherwise, establish a new connection
  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;