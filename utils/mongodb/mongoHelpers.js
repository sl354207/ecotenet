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
const getAdminPosts = async (status, approved) => {
  try {
    const db = await connectToDatabase();

    const posts = await db
      .collection("posts")
      .find({ status: status, approved: approved })
      .project({
        approved: 1,
        title: 1,
        description: 1,
        name: 1,
        id: 1,
        version: 1,
        rows: 1,
        tags: 1,
        originalUrl: 1,
      })
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
const getPublishedApprovedPostById = async (_id) => {
  try {
    const db = await connectToDatabase();
    // POTENTIALLY UPDATE RETURNING VOTERS

    const post = await db.collection("posts").findOne({
      _id: new ObjectId(_id),
      status: "published",
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
const getTiedPosts = async (species) => {
  try {
    const db = await connectToDatabase();

    const posts = await db
      .collection("posts")
      .find({ status: "published", approved: "true", species: species })
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

const deleteComment = async (_id) => {
  try {
    const db = await connectToDatabase();

    const deleted = await db.collection("comments").updateOne(
      {
        _id: new ObjectId(_id),
      },
      { $set: { text: "Comment deleted", name: "", approved: "true" } }
    );

    return deleted;
  } catch (error) {
    throw new Error(error);
  }
};

const getSpecies = async (speciesType, observed_ecoregions) => {
  try {
    const db = await connectToDatabase();

    const species = await db
      .collection("species")
      .find({
        species_type: speciesType,
        observed_ecoregions: observed_ecoregions,
      })
      .project({
        scientific_name: 1,
        common_name: 1,
        observed_ecoregions: 1,
        native_ecoregions: 1,
        freshwater_ecoregions: 1,
        soil_regions: 1,
        specific_soil_names: 1,
        soil_observations: 1,
      })
      .sort({ scientific_name: 1 })
      .toArray();

    return species;
  } catch (error) {
    throw new Error(error);
  }
};
const getNativeSpecies = async (speciesType, native_ecoregions) => {
  try {
    const db = await connectToDatabase();

    const species = await db
      .collection("species")
      .find({
        species_type: speciesType,
        native_ecoregions: native_ecoregions,
      })
      .project({
        scientific_name: 1,
        common_name: 1,
        observed_ecoregions: 1,
        native_ecoregions: 1,
        freshwater_ecoregions: 1,
        soil_regions: 1,
        specific_soil_names: 1,
        soil_observations: 1,
      })
      .sort({ scientific_name: 1 })
      .toArray();

    return species;
  } catch (error) {
    throw new Error(error);
  }
};
const getFeowSpecies = async (speciesType, freshwater_ecoregions) => {
  try {
    const db = await connectToDatabase();

    const species = await db
      .collection("species")
      .find({
        species_type: speciesType,
        freshwater_ecoregions: freshwater_ecoregions,
      })
      .project({
        scientific_name: 1,
        common_name: 1,
        observed_ecoregions: 1,
        native_ecoregions: 1,
        freshwater_ecoregions: 1,
        soil_regions: 1,
        specific_soil_names: 1,
        soil_observations: 1,
      })
      .sort({ scientific_name: 1 })
      .toArray();

    return species;
  } catch (error) {
    throw new Error(error);
  }
};
const getDsmwSpecies = async (speciesType, specific_soil_names) => {
  try {
    const db = await connectToDatabase();

    const species = await db
      .collection("species")
      .find({
        species_type: speciesType,
        specific_soil_names: specific_soil_names,
      })
      .project({
        scientific_name: 1,
        common_name: 1,
        observed_ecoregions: 1,
        native_ecoregions: 1,
        freshwater_ecoregions: 1,
        soil_regions: 1,
        specific_soil_names: 1,
        soil_observations: 1,
      })
      .sort({ scientific_name: 1 })
      .toArray();

    return species;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllSpecies = async () => {
  try {
    const db = await connectToDatabase();

    const species = await db
      .collection("species")
      .find({})
      .project({ scientific_name: 1, _id: 0 })
      .toArray();

    return species;
  } catch (error) {
    throw new Error(error);
  }
};

// retrieve single mammal by id from database
const getSpeciesByScientificName = async (name) => {
  try {
    const db = await connectToDatabase();

    const species = await db.collection("species").findOne(
      {
        scientific_name: name,
      },
      {
        projection: {
          scientific_name: 1,
          common_name: 1,
          observed_ecoregions: 1,
          native_ecoregions: 1,
          freshwater_ecoregions: 1,
          species_type: 1,
        },
      }
    );

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
                  },
                },
              ],
              filter: [
                // {
                //   compound: {
                //     must: [
                //       {
                //         text: {
                //           query: "published",
                //           path: "status",
                //         },
                //       },
                //       {
                //         text: {
                //           query: "true",
                //           path: "approved",
                //         },
                //       },
                //     ],
                //   },
                // },
                {
                  text: {
                    query: "published",
                    path: "status",
                  },
                },
                {
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
            index: "searchSpeciesTest",
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
        {
          $project: {
            scientific_name: 1,
            common_name: 1,
            observed_ecoregions: 1,
            native_ecoregions: 1,
            freshwater_ecoregions: 1,
            soil_regions: 1,
            specific_soil_names: 1,
            soil_observations: 1,
          },
        },
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
                },
                {
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
                    path: "observed_ecoregions",
                  },
                },
              ],
            },
          },
        },
        {
          $project: {
            scientific_name: 1,
            common_name: 1,
            observed_ecoregions: 1,
            native_ecoregions: 1,
            freshwater_ecoregions: 1,
          },
        },
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
            index: "autoSpeciesTest",
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
        {
          $project: {
            scientific_name: 1,
            common_name: 1,
            observed_ecoregions: 1,
            native_ecoregions: 1,
            freshwater_ecoregions: 1,
            soil_regions: 1,
          },
        },
      ])
      .limit(50)
      .toArray();

    return results;
  } catch (error) {
    throw new Error(error);
  }
};
const adminAutoSpecies = async (query) => {
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
        {
          $project: {
            scientific_name: 1,
            common_name: 1,
            observed_ecoregions: 1,
            native_ecoregions: 1,
            freshwater_ecoregions: 1,
            species_type: 1,
          },
        },
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
    const species = await db.collection("species").estimatedDocumentCount({});
    const posts = await db
      .collection("posts")
      .count({ status: "published", approved: "true" });

    const stats = {
      comments: comments,
      people: people,
      species: species,
      posts: posts,
    };

    return stats;
  } catch (error) {
    throw new Error(error);
  }
};
const getSitemapStats = async () => {
  try {
    const db = await connectToDatabase();

    const species = await db.collection("species").estimatedDocumentCount({});
    const ecoregions = await db
      .collection("ecoregions")
      .estimatedDocumentCount({});

    const stats = {
      species: species,
      ecoregions: ecoregions,
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
const getAllPeople = async (blocked) => {
  try {
    const db = await connectToDatabase();

    const people = await db
      .collection("users")
      .find({
        blocked: blocked,
      })

      .project({ name: 1 })
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
const getAdminNotifications = async () => {
  try {
    const db = await connectToDatabase();

    const notifications = await db
      .collection("notifications")
      .find({ reason: "admin", viewed: false })
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
      .project({ unique_id: 1, name: 1, coordinates: 1, url: 1, _id: 0 })
      .toArray();

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const getFeowEcoregions = async () => {
  try {
    const db = await connectToDatabase();

    const response = await db
      .collection("feow")
      .find({})
      .project({ id: 1, name: 1, coordinates: 1, _id: 0 })
      .toArray();

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const getDsmwRegions = async () => {
  try {
    const db = await connectToDatabase();

    const response = await db
      .collection("dsmw")
      .aggregate([
        {
          $group: {
            _id: "$specific_soil_name",
            coordinates: { $first: "$coordinates" },
            dominant_soil_name: { $first: "$dominant_soil_name" },
            dominant_soil_type_percentage: {
              $first: "$dominant_soil_type_percentage",
            },
            soil_texture: { $first: "$soil_texture" },
            soil_slope: { $first: "$soil_slope" },
            id: { $first: "$id" },
          },
        },
        {
          $project: {
            _id: 0,
            specific_soil_name: "$_id",
            coordinates: 1,
            dominant_soil_name: 1,
            dominant_soil_type_percentage: 1,
            soil_texture: 1,
            soil_slope: 1,
            id: 1,
          },
        },
      ])
      .toArray();
    // const response = await db
    //   .collection("dsmw")
    //   .find({})
    //   .project({ specific_soil_name: 1, coordinates: 1, _id: 0 })
    //   .toArray();

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
      { projection: { unique_id: 1, name: 1, url: 1, coordinates: 1, _id: 0 } }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const getFeowById = async (id) => {
  try {
    const db = await connectToDatabase();

    const response = await db.collection("feow").findOne(
      {
        id: id,
      },
      { projection: { _id: 0 } }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const getDistinctCategory = async (category) => {
  try {
    const db = await connectToDatabase();

    const response = await db.collection("species").distinct(category);

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const getFilteredStats = async (v1, v2) => {
  try {
    const db = await connectToDatabase();

    const response = await db
      .collection("species")
      .find({ [v1]: v2 })
      .project({ observed_ecoregions: 1, _id: 0 })
      .toArray();

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const getStatsAPIEcoregions = async () => {
  try {
    const db = await connectToDatabase();

    const response = await db
      .collection("ecoregions")
      .find({})
      .project({ unique_id: 1, name: 1, coordinates: 1, _id: 0 })
      .toArray();

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const getStatsEcoregions = async () => {
  try {
    const db = await connectToDatabase();

    const response = await db
      .collection("ecoregions")
      .find({})
      .project({
        unique_id: 1,
        name: 1,
        coordinates: 1,
        species_count: 1,
        _id: 0,
      })
      .toArray();

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const getDonations = async () => {
  try {
    const db = await connectToDatabase();

    const response = await db
      .collection("donations")
      .find({})
      .project({ _id: 0 })
      .toArray();

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const updateDonations = async (data) => {
  try {
    const db = await connectToDatabase();

    const response = await db.collection("donations").updateOne(
      {
        _id: new ObjectId("656a49cf9e6b898802592941"),
      },
      {
        $inc: data,
      }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const getLatestPosts = async (page, pageSize) => {
  try {
    const db = await connectToDatabase();

    const response = await db
      .collection("posts")
      .aggregate([
        {
          $facet: {
            data: [
              { $match: { status: "published", approved: "true" } },
              { $sort: { date: -1 } },
              { $skip: (page - 1) * pageSize },
              { $limit: pageSize },

              {
                $project: {
                  title: 1,
                  description: 1,
                  name: 1,
                  count: 1,
                  category: 1,
                  ecoregions: 1,
                },
              },
            ],
          },
        },
      ])

      .toArray();

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const getLatestEcoPosts = async (ecoregion, page, pageSize) => {
  try {
    const db = await connectToDatabase();

    const response = await db
      .collection("posts")
      .aggregate([
        {
          $facet: {
            data: [
              {
                $match: {
                  status: "published",
                  approved: "true",
                  ecoregions: ecoregion,
                },
              },
              { $sort: { date: -1 } },
              { $skip: (page - 1) * pageSize },
              { $limit: pageSize },

              {
                $project: {
                  title: 1,
                  description: 1,
                  name: 1,
                  count: 1,
                  category: 1,
                  ecoregions: 1,
                },
              },
            ],
          },
        },
      ])

      .toArray();

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const getLatestCategoryPosts = async (category, page, pageSize) => {
  try {
    const db = await connectToDatabase();

    const response = await db
      .collection("posts")
      .aggregate([
        {
          $facet: {
            data: [
              {
                $match: {
                  status: "published",
                  approved: "true",
                  category: category,
                },
              },
              { $sort: { date: -1 } },
              { $skip: (page - 1) * pageSize },
              { $limit: pageSize },

              {
                $project: {
                  title: 1,
                  description: 1,
                  name: 1,
                  count: 1,
                  category: 1,
                  ecoregions: 1,
                },
              },
            ],
          },
        },
      ])

      .toArray();

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const updateSpecies = async (data) => {
  try {
    const db = await connectToDatabase();

    const response = await db.collection("species").updateOne(
      {
        scientific_name: data.scientific_name,
      },
      { $set: data }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const getAdminPending = async () => {
  try {
    const db = await connectToDatabase();

    const posts = await db
      .collection("posts")
      .count({ status: "published", approved: "pending" });

    const comments = await db
      .collection("comments")
      .count({ approved: "pending" });

    const people = await db.collection("users").count({ approved: "pending" });

    const flags = await db.collection("flags").count({ status: "pending" });

    const notifications = await db
      .collection("notifications")
      .count({ reason: "admin", viewed: false });

    return {
      posts: posts,
      comments: comments,
      people: people,
      flags: flags,
      notifications: notifications,
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  connectToDatabase,
  createPost,
  getPosts,
  getAdminPosts,
  getPostsByCategoryAndRegion,
  getFeatures,
  getFeatureCandidates,
  getPostVotes,
  getDashboardPosts,
  getProfilePosts,
  getComments,
  getPostById,
  getPublishedApprovedPostById,
  getTiedPosts,
  updatePost,
  updateVote,
  deletePost,
  createComment,
  getPostComments,
  getDashboardComments,
  updateComment,
  deleteComment,
  getSpecies,
  getNativeSpecies,
  getFeowSpecies,
  getDsmwSpecies,
  getAllSpecies,
  getSpeciesByScientificName,
  searchAllPosts,
  searchAllSpecies,
  searchEcoPosts,
  searchEcoSpecies,
  autoSpecies,
  adminAutoSpecies,
  getStats,
  getSitemapStats,
  getPeople,
  getAllPeople,
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
  getAdminNotifications,
  updateNotification,
  checkName,
  getEcoregions,
  getFeowEcoregions,
  getDsmwRegions,
  getEcoregionById,
  getFeowById,
  getDistinctCategory,
  getFilteredStats,
  getStatsAPIEcoregions,
  getStatsEcoregions,
  getDonations,
  updateDonations,
  getLatestPosts,
  getLatestEcoPosts,
  getLatestCategoryPosts,
  updateSpecies,
  getAdminPending,
};
