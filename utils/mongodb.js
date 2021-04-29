import { MongoClient, ObjectID } from 'mongodb'

const { MONGODB_URI, MONGODB_DB } = process.env

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

if (!MONGODB_DB) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      }
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

// query database to get all published posts
const getPosts = async () => {
  
  const { db } = await connectToDatabase();

  const posts = await db
    .collection("published_posts")
    .find({})
    .limit(20)
    .toArray();

  return posts;
}

// add a draft to database with specific format from editor with id, version, and rows as input data.
const createDraft = async (id, version, rows) => {
  const { db } = await connectToDatabase();

  const data = {id, version, rows}
  const response = await db.collection("drafts").insertOne(data)

  return data;

} 

// retrieve single draft from database
const getDraft = async () => {
  
  const { db } = await connectToDatabase();

  const draft = await db
    .collection("drafts")
    .findOne({
      _id: ObjectID("608abf484014019848172fdf")
    });

  return draft;
}

// export default async function getMovie() {
  
//   const { db } = await connectToDatabase();

//   const movie = await db
//     .collection("bookings")
//     .findOne({
//       id: "mnsvyx"
//     });

//   return movie;
// }

// const createMovie = async (value) => {
//   const { db } = await connectToDatabase();

//   const data = {value}
//   const response = await db.collection("bookings").insertOne(data)

//   return data;

// } 

module.exports = {
  connectToDatabase,
  getPosts,
  createDraft,
  getDraft
}

 

