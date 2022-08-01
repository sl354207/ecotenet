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
  featured,
  date,
  feature
) => {
  const count = 0;
  const voters = [];

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
    date,
    feature,
    voters,
  };

  const response = await db.collection("posts").insertOne(data);

  return response;
};

// query database to get all published posts
const getPosts = async (status, approved) => {
  const { db } = await connectToDatabase();

  const posts = await db
    .collection("posts")
    .find(
      { status: status, approved: approved },
      { title: 1, description: 1, author: 1, count: 1, approved: 1 }
    )
    .sort({ count: -1 })
    .toArray();

  return posts;
};
const getPostsByCategoryAndRegion = async (category, ecoregion) => {
  const { db } = await connectToDatabase();

  const posts = await db
    .collection("posts")
    .find(
      {
        status: "published",
        approved: "true",
        category: category,
        ecoregions: ecoregion,
      },
      { title: 1, description: 1, author: 1, count: 1, approved: 1 }
    )
    .sort({ count: -1 })
    .toArray();

  return posts;
};
// query database to get all published posts
const getFeatures = async () => {
  const { db } = await connectToDatabase();

  const features = await db
    .collection("posts")
    .find(
      { feature: "true" },
      { title: 1, description: 1, author: 1, count: 1, approved: 1 }
    )

    .toArray();

  return features;
};
const getFeatureCandidates = async () => {
  const { db } = await connectToDatabase();

  const features = await db
    .collection("posts")
    .find(
      { feature: { $ne: "false" } },
      { title: 1, author: 1, count: 1, date: 1, featured: 1, feature: 1 }
    )
    .sort({ feature: -1 })
    .toArray();

  return features;
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
    .find(
      { name: name, status: status },
      { title: 1, description: 1, author: 1, count: 1, approved: 1 }
    )
    .sort({ count: 1 })
    .toArray();

  return posts;
};

const getProfilePosts = async (name) => {
  const { db } = await connectToDatabase();

  const posts = await db
    .collection("posts")
    .find(
      { name: name, status: "published", approved: "true" },
      { title: 1, description: 1, author: 1, count: 1 }
    )
    .sort({ count: -1 })
    .toArray();

  return posts;
};

// update a post
const updatePost = async (_id, data) => {
  const { db } = await connectToDatabase();

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

const updateComment = async (_id, data) => {
  const { db } = await connectToDatabase();

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

// UPDATE TO SPECIES TYPE FROM CLASS
//get mammals by unique eco id
const getSpecies = async (CLASS, unique_id) => {
  const { db } = await connectToDatabase();

  const species = await db
    .collection("species")
    .find(
      {
        CLASS: CLASS,
        unique_id: unique_id,
      },
      { Scientific_Name: 1, COMMON_NAME: 1 }
    )
    .sort({ Scientific_Name: 1 })
    .toArray();

  return species;
};

// CHANGE TO SPECIES INSTEAD OF MAMMALS
// retrieve single mammal by id from database
const getSpeciesById = async (id) => {
  const { db } = await connectToDatabase();

  const species = await db.collection("species").findOne({
    _id: ObjectId(id),
  });

  return species;
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
      { $project: { title: 1, description: 1, author: 1, count: 1 } },
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
      { $project: { Scientific_Name: 1, COMMON_NAME: 1 } },
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
      { $project: { title: 1, description: 1, author: 1, count: 1 } },
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
      { $project: { Scientific_Name: 1, COMMON_NAME: 1 } },
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
      { $project: { Scientific_Name: 1, COMMON_NAME: 1 } },
    ])
    .limit(50)
    .toArray();

  return results;
};

const getStats = async () => {
  const { db } = await connectToDatabase();

  const comments = await db.collection("comments").estimatedDocumentCount({});
  const people = await db.collection("people").estimatedDocumentCount({});
  const flags = await db.collection("flags").estimatedDocumentCount({});
  const species = await db.collection("species").estimatedDocumentCount({});
  const posts = await db
    .collection("posts")
    .count({ status: "published", approved: "true" });

  const stats = {
    comments: comments,
    people: people,
    flags: flags,
    species: species,
    posts: posts,
  };

  return stats;
};
const getPeople = async () => {
  const { db } = await connectToDatabase();

  const people = await db
    .collection("users")
    .find({
      approved: "pending",
    })
    .toArray();

  return people;
};

const getPerson = async (name) => {
  const { db } = await connectToDatabase();

  const person = await db.collection("users").findOne({
    name: name,
  });

  return person;
};
const updatePerson = async (email, data) => {
  const { db } = await connectToDatabase();

  const response = await db.collection("users").updateOne(
    {
      email: email,
    },
    { $set: data }
  );

  return response;
};
const updateDenials = async (name, denials) => {
  const { db } = await connectToDatabase();

  const response = await db.collection("people").updateOne(
    {
      name: name,
    },
    { $set: denials }
  );

  return response;
};

const deletePerson = async (name) => {
  const { db } = await connectToDatabase();

  const person = await db.collection("people").deleteOne({
    name: name,
  });

  const comments = await db.collection("comments").deleteMany({
    name: name,
  });
  const posts = await db.collection("posts").deleteMany({
    name: name,
  });
  const flags = await db.collection("flags").deleteMany({
    name: name,
  });
  const notifications = await db.collection("notifications").deleteMany({
    name: name,
  });

  const deleted = Object.assign(person, comments, posts, flags, notifications);
  // console.log(deleted);

  return deleted;
};

const createFlag = async (
  name,
  flagged,
  type,
  text,
  content_id,
  ref,
  status,
  date
) => {
  const { db } = await connectToDatabase();

  const data = { name, flagged, type, text, content_id, ref, status, date };
  const response = await db.collection("flags").insertOne(data);

  return response;
};

const getFlags = async () => {
  const { db } = await connectToDatabase();

  const flags = await db
    .collection("flags")
    .find({ status: "pending" })
    .sort({ _id: -1 })
    .toArray();

  return flags;
};

const updateFlag = async (_id, status) => {
  const { db } = await connectToDatabase();

  const response = await db.collection("flags").updateOne(
    {
      _id: ObjectId(_id),
    },
    { $set: { status: status } }
  );

  return response;
};

const createNotification = async (
  name,
  reason,
  text,
  add_info,
  ref,
  date,
  viewed
) => {
  const { db } = await connectToDatabase();

  const data = { name, reason, text, add_info, ref, date, viewed };
  const response = await db.collection("notifications").insertOne(data);

  return response;
};

const getNotifications = async (name) => {
  const { db } = await connectToDatabase();

  const notifications = await db
    .collection("notifications")
    .find({ name: name, viewed: false })
    .toArray();

  return notifications;
};

const updateNotification = async (_id, viewed) => {
  const { db } = await connectToDatabase();

  const response = await db.collection("notifications").updateOne(
    {
      _id: ObjectId(_id),
    },
    { $set: { viewed: viewed } }
  );

  return response;
};

const checkName = async (name) => {
  const { db } = await connectToDatabase();

  const response = await db.collection("users").findOne({
    name: { $regex: new RegExp("^" + name + "$", "i") },
  });

  return response;
};

const checkPerson = async (name) => {
  const { db } = await connectToDatabase();

  const response = await db.collection("users").findOne(
    {
      name: name,
    },
    { name: 1, email: 1 }
  );

  return response;
};
const getEcoregion = async (id) => {
  const { db } = await connectToDatabase();

  const response = await db.collection("ecoregions").findOne(
    {
      unique_id: id,
    },
    { unique_id: 1, name: 1, url: 1 }
  );

  return response;
};

module.exports = {
  connectToDatabase,
  createPost,
  getPosts,
  getPostsByCategoryAndRegion,
  getFeatures,
  getFeatureCandidates,
  getDashboardPosts,
  getProfilePosts,
  getComments,
  getPostById,
  updatePost,
  deletePost,
  createComment,
  getPostComments,
  getDashboardComments,
  updateComment,
  deleteComment,
  getSpecies,
  getSpeciesById,
  searchAllPosts,
  searchAllSpecies,
  searchEcoPosts,
  searchEcoSpecies,
  autoSpecies,
  getStats,
  getPeople,
  getPerson,
  updatePerson,
  updateDenials,
  deletePerson,
  createFlag,
  getFlags,
  updateFlag,
  createNotification,
  getNotifications,
  updateNotification,
  checkName,
  checkPerson,
  getEcoregion,
};
