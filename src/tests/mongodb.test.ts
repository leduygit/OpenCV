import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectToDatabase from "../lib/db/mongodb";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri; // Tạm thời gán URI giả lập cho MongoDB
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  await mongoServer.stop();
});

test("Should connect to in-memory MongoDB", async () => {
  const connection = await connectToDatabase();
  expect(connection.connection.readyState).toBe(1); // 1 = connected
});
