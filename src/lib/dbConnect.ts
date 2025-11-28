import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {

  if (!MONGODB_URI) {
    console.warn(" MONGODB_URI not defined — skipping DB connection (likely build phase).");
    return {} as Mongoose; // Return an empty Mongoose object or handle this case appropriately
  }
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // We start the connection and store the promise.
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'TuitionEd', 
      bufferCommands: false
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
    return cached.conn!;
}

export default dbConnect;
