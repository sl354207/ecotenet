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
  name,
  description,
  category,
  tags,
  ecoregions,
  id,
  version,
  rows,
  status,
  approved,
  updated,
  featured
) => {
  const count = 0;

  const { db } = await connectToDatabase();

  const data = {
    title,
    name,
    description,
    category,
    tags,
    ecoregions,
    id,
    version,
    rows,
    count,
    status,
    approved,
    updated,
    featured,
  };

  const response = await db.collection("posts").insertOne(data);

  return response;
};

// query database to get all published posts
const getPosts = async (status, approved) => {
  const { db } = await connectToDatabase();

  const posts = await db
    .collection("posts")
    .find({ status: status, approved: approved })
    .sort({ count: -1 })
    .toArray();

  return posts;
};
// query database to get all published posts
const getFeatured = async () => {
  const { db } = await connectToDatabase();

  const featured = await db
    .collection("posts")
    .find({ featured: true })

    .toArray();

  return featured;
};

// retrieve single post by id from database
const getPostById = async (_id) => {
  const { db } = await connectToDatabase();

  const post = await db.collection("posts").findOne({
    _id: ObjectId(_id),
  });

  return post;
};

// query database to get all drafts by user

// UPDATE TO GETPOSTSBYUSER
const getDashboardPosts = async (name, status) => {
  const { db } = await connectToDatabase();

  const posts = await db
    .collection("posts")
    .find({ name: name, status: status })
    .sort({ count: 1 })
    .toArray();

  return posts;
};

// update a post
const updatePost = async (
  title,
  name,
  description,
  category,
  tags,
  ecoregions,
  _id,
  id,
  version,
  rows,
  status,
  approved,
  updated,
  featured
) => {
  const { db } = await connectToDatabase();

  const data = {
    title,
    name,
    description,
    category,
    tags,
    ecoregions,
    id,
    version,
    rows,
    status,
    approved,
    updated,
    featured,
  };
  const response = await db.collection("posts").updateOne(
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

  const post = await db.collection("posts").deleteOne({
    _id: ObjectId(_id),
  });

  const comments = await db.collection("comments").deleteMany({
    post_id: _id,
  });

  const deleted = Object.assign(post, comments);
  // console.log(deleted);

  return deleted;
};

//create a comment
const createComment = async (
  name,
  post_id,
  comment_ref,
  date,
  text,
  approved,
  updated
) => {
  const { db } = await connectToDatabase();

  const data = { name, post_id, comment_ref, date, text, approved, updated };
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
      approved: "true",
    })
    .toArray();

  return comments;
};

const getDashboardComments = async (name) => {
  const { db } = await connectToDatabase();

  const comments = await db
    .collection("comments")
    .find({ name: name })
    .toArray();

  return comments;
};
const getComments = async (approved) => {
  const { db } = await connectToDatabase();

  const comments = await db
    .collection("comments")
    .find({ approved: approved })
    .sort({ _id: -1 })
    .toArray();

  return comments;
};

// update comment
const updateComment = async (_id, date, text, approved, updated) => {
  const { db } = await connectToDatabase();

  const data = {
    date,
    text,
    approved,
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
    .collection("posts")
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
                    maxEdits: 2,
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
                  query: "published",
                  path: "status",
                },
                text: {
                  query: "true",
                  path: "approved",
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
              maxEdits: 1,
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
    .collection("posts")
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
                    maxEdits: 2,
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
                // text: {
                //   query: "313",
                //   path: "ecoregions",
                // },
              },
            ],
            filter: [
              {
                text: {
                  query: "313",
                  path: "ecoregions",
                },
                text: {
                  query: "published",
                  path: "status",
                },
                text: {
                  query: "true",
                  path: "approved",
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
                    maxEdits: 1,
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

const autoSpecies = async (query) => {
  const { db } = await connectToDatabase();

  const results = await db
    .collection("species")
    .aggregate([
      {
        $search: {
          index: "autoSpecies",
          compound: {
            should: [
              {
                autocomplete: {
                  query: `${query}`,
                  path: "Scientific_Name",
                },
              },
              {
                autocomplete: {
                  query: `${query}`,
                  path: "COMMON_NAME",
                },
              },
            ],
          },
        },
      },
    ])
    .limit(10)
    .toArray();

  return results;
};

module.exports = {
  connectToDatabase,
  createPost,
  getPosts,
  getFeatured,
  getDashboardPosts,
  getComments,
  getPostById,
  updatePost,
  deletePost,
  createComment,
  getPostComments,
  getDashboardComments,
  updateComment,
  deleteComment,
  getMammals,
  getMammalById,
  searchAllPosts,
  searchAllSpecies,
  searchEcoPosts,
  searchEcoSpecies,
  autoSpecies,
};
