import { clientPromise } from "@utils/mongodb/mongoPromise";
import { ObjectId } from "mongodb";

const { MONGODB_DB } = process.env;

const connectToDatabase = async () => {
  try {
    const client = await clientPromise;
    const db = client.db(MONGODB_DB);

    return db;
  } catch (error) {
    throw new Error(error);
  }
};

// add a post to database with specific format from editor with id, version, and rows as input data.
const createPost = async (data) => {
  const count = 0;
  const voters = [];
  try {
    const db = await connectToDatabase();

    const post = {
      ...data,
      count,
      voters,
    };

    const response = await db.collection("posts").insertOne(post);

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

// query database to get all published posts
const getPosts = async (status, approved) => {
  try {
    const db = await connectToDatabase();

    const posts = await db
      .collection("posts")
      .find({ status: status, approved: approved })
      .project({ title: 1, description: 1, name: 1, count: 1, approved: 1 })
      .sort({ count: -1 })
      .toArray();

    return posts;
  } catch (error) {
    throw new Error(error);
  }
};
const getPostsByCategoryAndRegion = async (category, ecoregion) => {
  try {
    const db = await connectToDatabase();

    const posts = await db
      .collection("posts")
      .find({
        status: "published",
        approved: "true",
        category: category,
        ecoregions: ecoregion,
      })
      .project({
        title: 1,
        description: 1,
        name: 1,
        count: 1,
        ecoregions: 1,
      })
      .sort({ count: -1 })
      .toArray();

    return posts;
  } catch (error) {
    throw new Error(error);
  }
};
// query database to get all published posts
const getFeatures = async () => {
  try {
    const db = await connectToDatabase();

    const features = await db
      .collection("posts")
      .find({ feature: "true" })
      .project({
        title: 1,
        description: 1,
        category: 1,
        name: 1,
        count: 1,
        ecoregions: 1,
      })
      .sort({ count: -1 })
      .toArray();

    return features;
  } catch (error) {
    throw new Error(error);
  }
};
const getFeatureCandidates = async () => {
  try {
    const db = await connectToDatabase();

    const features = await db
      .collection("posts")
      .find({ feature: { $ne: "false" } })
      .project({
        title: 1,
        name: 1,
        count: 1,
        date: 1,
        featured: 1,
        feature: 1,
      })
      .sort({ feature: -1 })
      .toArray();

    return features;
  } catch (error) {
    throw new Error(error);
  }
};

// retrieve single post by id from database
const getPostById = async (_id) => {
  try {
    const db = await connectToDatabase();

    const post = await db.collection("posts").findOne({
      _id: new ObjectId(_id),
    });

    return post;
  } catch (error) {
    throw new Error(error);
  }
};
// retrieve single post by id from database
const getApprovedPostById = async (_id) => {
  try {
    const db = await connectToDatabase();
    // POTENTIALLY UPDATE RETURNING VOTERS

    const post = await db.collection("posts").findOne({
      _id: new ObjectId(_id),
      approved: "true",
    });

    return post;
  } catch (error) {
    throw new Error(error);
  }
};

// retrieve single post by id from database
const getPostVotes = async (_id) => {
  try {
    const db = await connectToDatabase();

    const post = await db.collection("posts").findOne(
      {
        _id: new ObjectId(_id),
      },
      { projection: { count: 1, voters: 1 } }
    );

    return post;
  } catch (error) {
    throw new Error(error);
  }
};

const getDashboardPosts = async (name, status) => {
  try {
    const db = await connectToDatabase();

    const posts = await db
      .collection("posts")
      .find({ name: name, status: status })
      .project({
        title: 1,
        description: 1,
        name: 1,
        count: 1,
        category: 1,
        approved: 1,
      })
      .sort({ count: 1 })
      .toArray();

    return posts;
  } catch (error) {
    throw new Error(error);
  }
};

const getProfilePosts = async (name) => {
  try {
    const db = await connectToDatabase();

    const posts = await db
      .collection("posts")
      .find({ name: name, status: "published", approved: "true" })
      .project({ title: 1, description: 1, name: 1, count: 1, category: 1 })
      .sort({ count: -1 })
      .toArray();

    return posts;
  } catch (error) {
    throw new Error(error);
  }
};

// update a post
const updatePost = async (_id, data) => {
  try {
    const db = await connectToDatabase();

    const response = await db.collection("posts").updateOne(
      {
        _id: new ObjectId(_id),
      },
      { $set: data }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const updateVote = async (data) => {
  try {
    const db = await connectToDatabase();

    const response = await db.collection("posts").updateOne(
      {
        _id: new ObjectId(data._id),
      },
      {
        $push: { voters: data.name },
        $inc: { count: data.vote },
      }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

//delete a post
const deletePost = async (_id) => {
  try {
    const db = await connectToDatabase();

    const post = await db.collection("posts").deleteOne({
      _id: new ObjectId(_id),
    });

    const comments = await db.collection("comments").deleteMany({
      post_id: _id,
    });

    const deleted = Object.assign(post, comments);
    // console.log(deleted);

    return deleted;
  } catch (error) {
    throw new Error(error);
  }
};

//create a comment
const createComment = async (data) => {
  try {
    const db = await connectToDatabase();

    const comment = { ...data };

    const response = await db.collection("comments").insertOne(comment);

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

//get post comments
const getPostComments = async (id) => {
  try {
    const db = await connectToDatabase();

    const comments = await db
      .collection("comments")
      .find({
        post_id: id,
        approved: "true",
      })
      .project({ approved: 0 })
      .toArray();

    return comments;
  } catch (error) {
    throw new Error(error);
  }
};

const getDashboardComments = async (name) => {
  try {
    const db = await connectToDatabase();

    const comments = await db
      .collection("comments")
      .find({ name: name })
      .toArray();

    return comments;
  } catch (error) {
    throw new Error(error);
  }
};
const getComments = async (approved) => {
  try {
    const db = await connectToDatabase();

    const comments = await db
      .collection("comments")
      .find({ approved: approved })
      .sort({ _id: -1 })
      .toArray();

    return comments;
  } catch (error) {
    throw new Error(error);
  }
};

const updateComment = async (_id, data) => {
  try {
    const db = await connectToDatabase();

    const response = await db.collection("comments").updateOne(
      {
        _id: new ObjectId(_id),
      },
      { $set: data }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

//delete a comment
// const deleteComment = async (_id) => {
//   try {
//     const db = await connectToDatabase();

//     const deleted = await db
//       .collection("comments")
//       .deleteMany({ $or: [{ _id: new ObjectId(_id) }, { comment_ref: _id }] });

//     return deleted;
//   } catch (error) {
//     throw new Error(error);
//   }
// };
const deleteComment = async (_id) => {
  try {
    const db = await connectToDatabase();

    const deleted = await db.collection("comments").updateOne(
      {
        _id: new ObjectId(_id),
      },
      { $set: { text: "Comment deleted", name: "" } }
    );

    return deleted;
  } catch (error) {
    throw new Error(error);
  }
};

//get mammals by unique eco id
const getSpecies = async (speciesType, unique_id) => {
  try {
    const db = await connectToDatabase();

    const species = await db
      .collection("species")
      .find({
        species_type: speciesType,
        unique_id: unique_id,
      })
      .project({ scientific_name: 1, common_name: 1, unique_id: 1 })
      .sort({ scientific_name: 1 })
      .toArray();

    return species;
  } catch (error) {
    throw new Error(error);
  }
};

// retrieve single mammal by id from database
const getSpeciesById = async (id) => {
  try {
    const db = await connectToDatabase();

    const species = await db.collection("species").findOne({
      _id: new ObjectId(id),
    });

    return species;
  } catch (error) {
    throw new Error(error);
  }
};

const searchAllPosts = async (query) => {
  try {
    const db = await connectToDatabase();

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
        {
          $project: {
            title: 1,
            description: 1,
            name: 1,
            count: 1,
            ecoregions: 1,
            category: 1,
          },
        },
      ])
      .toArray();

    return results;
  } catch (error) {
    throw new Error(error);
  }
};
const searchAllSpecies = async (query) => {
  try {
    const db = await connectToDatabase();

    const results = await db
      .collection("species")
      .aggregate([
        {
          $search: {
            index: "searchSpecies",
            text: {
              query: `${query}`,
              path: ["common_name", "scientific_name"],
              fuzzy: {
                maxEdits: 1,
                maxExpansions: 20,
              },
            },
          },
        },
        { $project: { scientific_name: 1, common_name: 1, unique_id: 1 } },
      ])
      .toArray();

    return results;
  } catch (error) {
    throw new Error(error);
  }
};
const searchEcoPosts = async (query, eco) => {
  try {
    const db = await connectToDatabase();

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
                {
                  text: {
                    query: `${eco}`,
                    path: "ecoregions",
                  },
                },
              ],
              filter: [
                {
                  // text: {
                  //   query: `${eco}`,
                  //   path: "ecoregions",
                  // },
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
        {
          $project: {
            title: 1,
            description: 1,
            name: 1,
            count: 1,
            ecoregions: 1,
            category: 1,
          },
        },
      ])
      .toArray();

    return results;
  } catch (error) {
    throw new Error(error);
  }
};
const searchEcoSpecies = async (query, eco) => {
  try {
    const db = await connectToDatabase();

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
                    path: ["common_name", "scientific_name"],
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
                    query: `${eco}`,
                    path: "unique_id",
                  },
                },
              ],
            },
          },
        },
        { $project: { scientific_name: 1, common_name: 1, unique_id: 1 } },
      ])
      .toArray();

    return results;
  } catch (error) {
    throw new Error(error);
  }
};

const autoSpecies = async (query) => {
  try {
    const db = await connectToDatabase();

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
                    path: "scientific_name",
                  },
                },
                {
                  autocomplete: {
                    query: `${query}`,
                    path: "common_name",
                  },
                },
              ],
            },
          },
        },
        { $project: { scientific_name: 1, common_name: 1, unique_id: 1 } },
      ])
      .limit(50)
      .toArray();

    return results;
  } catch (error) {
    throw new Error(error);
  }
};

const getStats = async () => {
  try {
    const db = await connectToDatabase();

    const comments = await db.collection("comments").estimatedDocumentCount({});
    const people = await db.collection("users").estimatedDocumentCount({});
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
  } catch (error) {
    throw new Error(error);
  }
};
const getPeople = async () => {
  try {
    const db = await connectToDatabase();

    const people = await db
      .collection("users")
      .find({
        approved: "pending",
      })
      .toArray();

    return people;
  } catch (error) {
    throw new Error(error);
  }
};

const getPerson = async (name) => {
  try {
    const db = await connectToDatabase();

    const person = await db.collection("users").findOne(
      {
        name: name,
      },
      {
        projection: { email: 0, denials: 0, emailVerified: 0, role: 0 },
      }
    );

    return person;
  } catch (error) {
    throw new Error(error);
  }
};
const getPersonAdmin = async (name) => {
  try {
    const db = await connectToDatabase();

    const person = await db.collection("users").findOne({
      name: name,
    });

    return person;
  } catch (error) {
    throw new Error(error);
  }
};
const getPersonDash = async (name) => {
  try {
    const db = await connectToDatabase();

    const person = await db.collection("users").findOne(
      {
        name: name,
      },
      { projection: { _id: 0, denials: 0, emailVerified: 0, role: 0 } }
    );

    return person;
  } catch (error) {
    throw new Error(error);
  }
};
const updatePerson = async (email, data) => {
  try {
    const db = await connectToDatabase();

    const response = await db.collection("users").updateOne(
      {
        email: email,
      },
      { $set: data }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const updateDenials = async (name, denials) => {
  try {
    const db = await connectToDatabase();

    const response = await db.collection("users").updateOne(
      {
        name: name,
      },
      { $set: denials }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const deletePerson = async (name) => {
  try {
    const db = await connectToDatabase();

    const notifications = await db.collection("notifications").deleteMany({
      name: name,
    });
    const flags = await db.collection("flags").deleteMany({
      name: name,
    });
    const votes = await db.collection("posts").updateMany(
      {
        voters: name,
      },
      { $pull: { voters: name } }
    );
    const comments = await db.collection("comments").updateMany(
      {
        name: name,
      },
      { $set: { text: "Comment deleted", name: "" } }
    );
    const posts = await db.collection("posts").deleteMany({
      name: name,
    });
    const person = await db.collection("users").deleteOne({
      name: name,
    });

    const deleted = Object.assign(
      person,
      comments,
      posts,
      flags,
      notifications,
      votes
    );
    // console.log(deleted);

    return deleted;
  } catch (error) {
    throw new Error(error);
  }
};

const createFlag = async (data) => {
  try {
    const db = await connectToDatabase();

    const flag = { ...data };
    const response = await db.collection("flags").insertOne(flag);

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const getFlags = async () => {
  try {
    const db = await connectToDatabase();

    const flags = await db
      .collection("flags")
      .find({ status: "pending" })
      .sort({ _id: -1 })
      .toArray();

    return flags;
  } catch (error) {
    throw new Error(error);
  }
};

const updateFlag = async (_id, status) => {
  try {
    const db = await connectToDatabase();

    const response = await db.collection("flags").updateOne(
      {
        _id: new ObjectId(_id),
      },
      { $set: { status: status } }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const createNotification = async (data) => {
  try {
    const db = await connectToDatabase();

    const notification = { ...data };
    const response = await db
      .collection("notifications")
      .insertOne(notification);

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const getNotifications = async (name) => {
  try {
    const db = await connectToDatabase();

    const notifications = await db
      .collection("notifications")
      .find({ name: name, viewed: false })
      .toArray();

    return notifications;
  } catch (error) {
    throw new Error(error);
  }
};

const updateNotification = async (_id, viewed) => {
  try {
    const db = await connectToDatabase();

    const response = await db.collection("notifications").updateOne(
      {
        _id: new ObjectId(_id),
      },
      { $set: { viewed: viewed } }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const checkName = async (name) => {
  try {
    const db = await connectToDatabase();

    const response = await db.collection("users").findOne(
      {
        name: { $regex: new RegExp("^" + name + "$", "i") },
      },
      { projection: { name: 1, _id: 0 } }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

// const checkPerson = async (name) => {
//   try {
//     const db = await connectToDatabase();

//     const response = await db.collection("users").findOne(
//       {
//         name: name,
//       },
//       { projection: { name: 1, email: 1, _id: 0 } }
//     );

//     return response;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

const getEcoregions = async () => {
  try {
    const db = await connectToDatabase();

    const response = await db
      .collection("ecoregions")
      .find({})
      .project({ unique_id: 1, name: 1, coordinates: 1, url: 1 })
      .toArray();

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const getEcoregionById = async (id) => {
  try {
    const db = await connectToDatabase();

    const response = await db.collection("ecoregions").findOne(
      {
        unique_id: id,
      },
      { projection: { unique_id: 1, name: 1, url: 1, coordinates: 1 } }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  connectToDatabase,
  createPost,
  getPosts,
  getPostsByCategoryAndRegion,
  getFeatures,
  getFeatureCandidates,
  getPostVotes,
  getDashboardPosts,
  getProfilePosts,
  getComments,
  getPostById,
  getApprovedPostById,
  updatePost,
  updateVote,
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
  getPersonDash,
  getPersonAdmin,
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
  getEcoregions,
  getEcoregionById,
};
