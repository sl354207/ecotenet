// EXAMPLE MONGO TEST

import { MongoClient } from "mongodb";
// import { connectToDatabase } from "@utils/mongodb/mongoHelpers";
// import { client } from "@utils/mongodb/mongoPromise";

describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // console.log(connection);
    // const client = await clientPromise;
    // db = await connectToDatabase();
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
    // console.log(db);
  });

  afterAll(async () => {
    await connection.close();
    // await client.close();
  });

  it("should insert a doc into collection", async () => {
    const users = db.collection("users");
    const mockUser = { _id: "some-user-id", name: "John" };

    try {
      await users.insertOne(mockUser);
      // await users.insertOne(mockUser); // duplicate key error
    } catch (error) {
      throw new Error(error);
    }
    const insertedUser = await users.findOne({ _id: "some-user-id" });
    expect(insertedUser).toEqual(mockUser);
  });
});
