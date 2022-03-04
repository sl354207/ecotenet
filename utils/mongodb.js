import { MongoClient, ObjectId } from "mongodb";

const { MONGODB_URI, MONGODB_DB } = process.env;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!MONGODB_DB) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

// add a post to database with specific format from editor with id, version, and rows as input data.
const createPost = async (
  title,
  author,
  description,
  category,
  tags,
  ecoregions,
  id,
  version,
  rows
) => {
  const count = 0;

  const { db } = await connectToDatabase();

  const data = {
    title,
    author,
    description,
    category,
    tags,
    ecoregions,
    id,
    version,
    rows,
    count,
  };

  const response = await db.collection("published_posts").insertOne(data);

  return response;
};

// query database to get all published posts
const getPosts = async () => {
  const { db } = await connectToDatabase();

  const posts = await db
    .collection("published_posts")
    .find({})
    .limit(20)
    .toArray();

  return posts;
};

// retrieve single post by id from database
const getPostById = async (_id) => {
  const { db } = await connectToDatabase();

  const post = await db.collection("published_posts").findOne({
    _id: ObjectId(_id),
  });

  return post;
};

// query database to get all drafts by user

// UPDATE TO GETPOSTSBYUSER
const getPostsByUser = async () => {
  const { db } = await connectToDatabase();

  const posts = await db
    .collection("published_posts")
    .find({})
    .limit(20)
    .toArray();

  return posts;
};

// update a post
const updatePost = async (
  title,
  author,
  description,
  category,
  tags,
  ecoregions,
  _id,
  id,
  version,
  rows
) => {
  const { db } = await connectToDatabase();

  const data = {
    title,
    author,
    description,
    category,
    tags,
    ecoregions,
    id,
    version,
    rows,
  };
  const response = await db.collection("published_posts").updateOne(
    {
      _id: ObjectId(_id),
    },
    { $set: data }
  );

  return response;
};

//delete a post
const deletePost = async (_id) => {
  const { db } = await connectToDatabase();

  const post = await db.collection("published_posts").deleteOne({
    _id: ObjectId(_id),
  });

  const comments = await db.collection("comments").deleteMany({
    post_id: _id,
  });

  const deleted = Object.assign(post, comments);
  console.log(deleted);

  return deleted;
};

// add a draft to database with specific format from editor with id, version, and rows as input data.
const createDraft = async (
  title,
  author,
  description,
  category,
  tags,
  ecoregions,
  id,
  version,
  rows
) => {
  const { db } = await connectToDatabase();

  const data = {
    title,
    author,
    description,
    category,
    tags,
    ecoregions,
    id,
    version,
    rows,
  };
  const response = await db.collection("drafts").insertOne(data);

  return response;
};

// query database to get all drafts by user

// UPDATE TO GETPOSTSBYUSER
const getDraftsByUser = async () => {
  const { db } = await connectToDatabase();

  const drafts = await db.collection("drafts").find({}).limit(20).toArray();

  return drafts;
};

// retrieve single draft by id from database
const getDraftById = async (id) => {
  const { db } = await connectToDatabase();

  const draft = await db.collection("drafts").findOne({
    _id: ObjectId(id),
  });

  return draft;
};

//update a draft
const updateDraft = async (
  title,
  author,
  description,
  category,
  tags,
  ecoregions,
  _id,
  id,
  version,
  rows
) => {
  const { db } = await connectToDatabase();

  const data = {
    title,
    author,
    description,
    category,
    tags,
    ecoregions,
    id,
    version,
    rows,
  };
  const response = await db.collection("drafts").updateOne(
    {
      _id: ObjectId(_id),
    },
    { $set: data }
  );

  return response;
};

//delete a draft
const deleteDraft = async (_id) => {
  const { db } = await connectToDatabase();

  const deleted = await db.collection("drafts").deleteOne({
    _id: ObjectId(_id),
  });

  return deleted;
};

//create a comment
const createComment = async (post_id, comment_ref, date, text, updated) => {
  const { db } = await connectToDatabase();

  const data = { post_id, comment_ref, date, text, updated };
  const response = await db.collection("comments").insertOne(data);

  return response;
};

//get post comments
const getPostComments = async (id) => {
  const { db } = await connectToDatabase();

  const comments = await db
    .collection("comments")
    .find({
      post_id: id,
    })
    .toArray();

  return comments;
};

const getCommentsByUser = async () => {
  const { db } = await connectToDatabase();

  const comments = await db.collection("comments").find({}).toArray();

  return comments;
};

// update comment
const updateComment = async (_id, date, text, updated) => {
  const { db } = await connectToDatabase();

  const data = {
    date,
    text,
    updated,
  };
  const response = await db.collection("comments").updateOne(
    {
      _id: ObjectId(_id),
    },
    { $set: data }
  );

  return response;
};

//delete a comment
const deleteComment = async (_id) => {
  const { db } = await connectToDatabase();

  const deleted = await db
    .collection("comments")
    .deleteMany({ $or: [{ _id: ObjectId(_id) }, { comment_ref: _id }] });

  return deleted;
};

// CHANGE TO SPECIES INSTEAD OF MAMMALS
//get mammals by unique eco id
const getMammals = async (CLASS, unique_id) => {
  const { db } = await connectToDatabase();

  const mammals = await db
    .collection("species")
    .find({
      CLASS: CLASS,
      unique_id: unique_id,
    })
    .sort({ Scientific_Name: 1 })
    .toArray();

  return mammals;
};

// CHANGE TO SPECIES INSTEAD OF MAMMALS
// retrieve single mammal by id from database
const getMammalById = async (id) => {
  const { db } = await connectToDatabase();

  const mammal = await db.collection("species").findOne({
    _id: ObjectId(id),
  });

  return mammal;
};

const searchAllPosts = async (query) => {
  const { db } = await connectToDatabase();

  const results = await db
    .collection("published_posts")
    .aggregate([
      {
        $search: {
          index: "searchPosts",
          text: {
            query: `${query}`,
            path: {
              wildcard: "*",
            },
            fuzzy: {
              maxExpansions: 20,
            },
            score: {
              function: {
                path: {
                  value: "count",
                },
              },
            },
          },
        },
      },
    ])
    .toArray();

  return results;
};
const searchAllSpecies = async (query) => {
  const { db } = await connectToDatabase();

  const results = await db
    .collection("species")
    .aggregate([
      {
        $search: {
          index: "searchSpecies",
          text: {
            query: `${query}`,
            path: ["COMMON_NAME", "Scientific_Name"],
            fuzzy: {
              maxExpansions: 20,
            },
          },
        },
      },
    ])
    .toArray();

  return results;
};
const searchEcoPosts = async (query) => {
  const { db } = await connectToDatabase();

  const results = await db
    .collection("published_posts")
    .aggregate([
      {
        $search: {
          index: "searchPosts",
          compound: {
            must: [
              {
                text: {
                  query: `${query}`,
                  path: {
                    wildcard: "*",
                  },
                  fuzzy: {
                    maxExpansions: 20,
                  },
                  score: {
                    function: {
                      path: {
                        value: "count",
                      },
                    },
                  },
                },
              },
            ],
            filter: [
              {
                text: {
                  query: "313",
                  path: "ecoregions",
                },
              },
            ],
          },
        },
      },
    ])
    .toArray();

  return results;
};
const searchEcoSpecies = async (query) => {
  const { db } = await connectToDatabase();

  const results = await db
    .collection("species")
    .aggregate([
      {
        $search: {
          index: "searchSpecies",
          compound: {
            must: [
              {
                text: {
                  query: `${query}`,
                  path: ["COMMON_NAME", "Scientific_Name"],
                  fuzzy: {
                    maxExpansions: 20,
                  },
                },
              },
            ],
            filter: [
              {
                text: {
                  query: "313",
                  path: "unique_id",
                },
              },
            ],
          },
        },
      },
    ])
    .toArray();

  return results;
};

module.exports = {
  connectToDatabase,
  createPost,
  getPosts,
  getPostsByUser,
  getPostById,
  updatePost,
  deletePost,
  createDraft,
  getDraftsByUser,
  getDraftById,
  updateDraft,
  deleteDraft,
  createComment,
  getPostComments,
  getCommentsByUser,
  updateComment,
  deleteComment,
  getMammals,
  getMammalById,
  searchAllPosts,
  searchAllSpecies,
  searchEcoPosts,
  searchEcoSpecies,
};
