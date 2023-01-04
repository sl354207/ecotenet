// EXAMPLE MONGO TEST

import {
  connectToDatabase,
  createComment,
  getPostComments,
} from "@utils/mongodb/mongoHelpers";
import { MongoClient } from "mongodb";
jest.mock("@utils/mongodb/mongoHelpers");

describe("Test mongodb comment helper functions for nosql injections and validation", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connectToDatabase.mockImplementation(async () => {
      db = await connection.db(globalThis.__MONGO_DB_NAME__);
      return Promise.resolve(db);
    });

    await connectToDatabase();

    await db.createCollection("comments", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "post_id",
            "comment_ref",
            "date",
            "text",
            "approved",
            "updated",
            "name",
          ],
          properties: {
            _id: {
              bsonType: "string",
            },
            post_id: {
              bsonType: "string",
              minLength: 24,
              maxLength: 24,
              description: "must be a string",
            },
            comment_ref: {
              oneOf: [
                {
                  bsonType: "string",
                  minLength: 24,
                  maxLength: 24,
                  description: "must be a string",
                },
                {
                  bsonType: "string",
                  enum: [""],
                  description: "must be an empty string",
                },
              ],
            },
            date: {
              bsonType: "string",
              description: "must be a string",
            },
            text: {
              bsonType: "string",
              description: "must be a string",
            },
            approved: {
              bsonType: "string",
              enum: ["true", "false", "pending"],
              description: "must be a string",
            },
            updated: {
              bsonType: "bool",
              description: "must be a boolean",
            },
            name: {
              bsonType: "string",
              description: "must be a string",
            },
          },
          additionalProperties: false,
        },
      },
    });
  });

  afterAll(async () => {
    await connection.close();
  });

  describe("Test createComment helper function", () => {
    beforeEach(async () => {
      await db.collection("comments").deleteMany({});
    });
    describe("Test field validation schema", () => {
      it("should insert a comment into collection", async () => {
        const comments = db.collection("comments");

        const mockComment = {
          _id: "test comment id",
          name: "test name",
          post_id: "012345678901234567890123",
          comment_ref: "",
          date: new Date().toUTCString(),
          text: "test comment",
          approved: "pending",
          updated: false,
        };

        createComment.mockImplementation(async (mockComment) => {
          const data = {
            ...mockComment,
          };

          const response = await db.collection("comments").insertOne(data);

          return Promise.resolve(response);
        });

        try {
          await createComment(mockComment);
        } catch (error) {
          throw new Error(error);
        }

        const insertedComment = await comments.findOne({
          _id: "test comment id",
        });

        expect(insertedComment).toEqual(mockComment);

        expect(connectToDatabase).toHaveBeenCalledTimes(1);
      });
      it("should not insert a comment into collection based on improper field", async () => {
        const mockComment = {
          _id: "test comment id",
          name: "test name",
          post_id: "012345678901234567890123",
          comment_ref: "a",
          date: new Date().toUTCString(),
          text: "test comment",
          approved: "pending",
          updated: false,
        };

        createComment.mockImplementation(async (mockComment) => {
          const data = {
            ...mockComment,
          };

          const response = await db.collection("comments").insertOne(data);

          return Promise.resolve(response);
        });

        await expect(createComment(mockComment)).rejects.toThrow();

        expect(connectToDatabase).toHaveBeenCalledTimes(1);
      });
      it("should not insert a comment into collection based on additional field", async () => {
        const mockComment = {
          _id: "test comment id",
          name: "test name",
          post_id: "012345678901234567890123",
          comment_ref: "",
          date: new Date().toUTCString(),
          text: "test comment",
          approved: "pending",
          updated: false,
          test_field: "test",
        };

        createComment.mockImplementation(async (mockComment) => {
          const data = {
            ...mockComment,
          };

          const response = await db.collection("comments").insertOne(data);

          return Promise.resolve(response);
        });

        await expect(createComment(mockComment)).rejects.toThrow();

        expect(connectToDatabase).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe("Test getPostComments helper function", () => {
    let mockComment;
    beforeAll(async () => {
      mockComment = {
        _id: "test comment id",
        name: "test name",
        post_id: "012345678901234567890123",
        comment_ref: "",
        date: new Date().toUTCString(),
        text: "test comment",
        approved: "true",
        updated: false,
      };

      createComment.mockImplementation(async (mockComment) => {
        const data = {
          ...mockComment,
        };

        const response = await db.collection("comments").insertOne(data);

        return Promise.resolve(response);
      });

      try {
        await createComment(mockComment);
      } catch (error) {
        throw new Error(error);
      }
    });
    describe("Test nosql injections", () => {
      describe("Blind boolean injections", () => {
        it("should retrieve a comment from collection", async () => {
          getPostComments.mockImplementation(async (mockComment) => {
            const data = mockComment;

            const response = await db
              .collection("comments")
              .find({
                post_id: data,
                approved: "true",
              })
              .toArray();

            return Promise.resolve(response);
          });

          const insertedComment = await getPostComments(
            "012345678901234567890123"
          );

          expect(insertedComment[0]).toEqual(mockComment);

          expect(connectToDatabase).toHaveBeenCalledTimes(1);
        });
        it("should not insert a comment into collection based on improper fields", async () => {
          getPostComments.mockImplementation(async (mockComment) => {
            const data = mockComment;

            const response = await db
              .collection("comments")
              .find({
                post_id: String(data),
                approved: "true",
              })
              .toArray();

            return Promise.resolve(response);
          });

          const mockGet1 = { $ne: -1 };
          const mockGet2 = { $in: [] };
          const mockGet3 = { $and: [{ id: 5 }, { id: 6 }] };
          const mockGet4 = { $where: "return true" };
          const mockGet5 = { $or: [{}, { foo: "1" }] };

          // await expect(getPostComments(mockGet1)).rejects.toThrow();
          // await expect(getPostComments(mockGet2)).rejects.toThrow();
          // await expect(getPostComments(mockGet3)).rejects.toThrow();
          // await expect(getPostComments(mockGet4)).rejects.toThrow();
          // await expect(getPostComments(mockGet5)).rejects.toThrow();

          expect(connectToDatabase).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
