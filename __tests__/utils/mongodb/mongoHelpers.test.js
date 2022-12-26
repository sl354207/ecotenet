// EXAMPLE MONGO TEST

import { connectToDatabase, createComment } from "@utils/mongodb/mongoHelpers";
import { MongoClient } from "mongodb";
jest.mock("@utils/mongodb/mongoHelpers");
// import { client } from "@utils/mongodb/mongoPromise";

// connectToDatabase = jest.fn();

describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // console.log(globalThis.__MONGO_URI__);
    // const client = await clientPromise;
    // db = await connectToDatabase();
    // db = await connection.db(globalThis.__MONGO_DB_NAME__);
    connectToDatabase.mockImplementation(async () => {
      db = await connection.db(globalThis.__MONGO_DB_NAME__);
      return Promise.resolve(db);
    });

    await connectToDatabase();

    await db.createCollection("students", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          title: "Student Object Validation",
          required: ["address", "major", "name", "year"],
          properties: {
            name: {
              bsonType: "string",
              description: "'name' must be a string and is required",
            },
            year: {
              bsonType: "int",
              minimum: 2017,
              maximum: 3017,
              description:
                "'year' must be an integer in [ 2017, 3017 ] and is required",
            },
            gpa: {
              bsonType: ["double"],
              description: "'gpa' must be a double if the field exists",
            },
          },
        },
      },
    });

    // connectToDatabase = jest.fn();
    // connectToDatabase.mockResolvedValue("test");

    // console.log(db);
  });

  afterAll(async () => {
    await connection.close();
    // await client.close();
  });

  it("should insert a doc into collection", async () => {
    // console.log(db);
    const students = db.collection("students");
    const comments = db.collection("comments");
    // const mockUser = { _id: "some-user-id", name: "John" };
    const mockComment = {
      _id: "test comment id",
      name: "test name",
      post_id: "test_id",
      comment_ref: "test ref",
      date: new Date().toUTCString(),
      text: "test comment",
      approved: "pending",
      updated: false,
    };

    createComment.mockImplementation(async (mockComment) => {
      const data = {
        ...mockComment,
      };
      // console.log(db);
      const response = await db.collection("comments").insertOne(data);

      return Promise.resolve(response);
    });
    // connectToDatabase.mockResolvedValueOnce("test");

    try {
      // await users.insertOne(mockUser);
      await createComment(mockComment);

      // await createComment(mockComment);
      // console.log(createComment.mock.results[0]);
      // await users.insertOne(mockUser); // duplicate key error
    } catch (error) {
      throw new Error(error);
    }

    try {
      await students.insertOne({
        name: "Alice",
        year: 3030,
        major: "History",
        gpa: 2.3,
        address: {
          city: "NYC",
          street: "33rd Street",
        },
      });
      // db.students.findOne({});
    } catch (error) {
      console.log(error);
    }

    const insertedComment = await comments.findOne({ _id: "test comment id" });
    // console.log(db);
    // console.log(insertedComment);
    expect(insertedComment).toEqual(mockComment);
    // const insertedUser = await users.findOne({ _id: "some-user-id" });
    // expect(insertedUser).toEqual(mockUser);
    // expect(connectToDatabase).toHaveBeenCalledTimes(1);
  });
});
