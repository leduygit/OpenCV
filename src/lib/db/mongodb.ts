// /lib/db/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections growing exponentially during API Route usage.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoosePromise: Promise<typeof mongoose> | null;
}

let cached = global.mongoosePromise;

if (!cached) {
  cached = global.mongoosePromise = null;
}

/**
 * Establishes a connection to the MongoDB database
 *
 * @returns {Promise<typeof import("mongoose")>} the connected mongoose instance
 */
async function connectToDatabase(): Promise<typeof import("mongoose")> {
  if (cached) {
    return cached;
  }

  cached = mongoose.connect(MONGODB_URI);

  return cached;
}

export default connectToDatabase;
