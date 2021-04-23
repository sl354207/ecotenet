import { MongoClient } from 'mongodb'

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

// query database to get all movies
const getMovies = async () => {
  
  const { db } = await connectToDatabase();

  const movies = await db
    .collection("movies")
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();

  return movies;
}

// add a movie to database with specific format from editor with id, version, and rows as input data.
const createMovie = async (id, version, rows) => {
  const { db } = await connectToDatabase();

  const data = {id, version, rows}
  const response = await db.collection("bookings").insertOne(data)

  return data;

} 

// retrieve single movie from database
const getMovie = async () => {
  
  const { db } = await connectToDatabase();

  const movie = await db
    .collection("bookings")
    .findOne({
      id: "mnsvyx"
    });

  return movie;
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
  getMovies,
  createMovie,
  getMovie
}

 

