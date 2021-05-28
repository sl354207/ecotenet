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

// add a post to database with specific format from editor with id, version, and rows as input data.
const createPost = async (title,
  author,
  description,
  category, 
  tags,
  id, 
  version, 
  rows) => {
  const { db } = await connectToDatabase();

  const data = {title,
    author,
    description,
    category, 
    tags,
    id, 
    version, 
    rows}
  const response = await db.collection("published_posts").insertOne(data)

  return data;

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

// retrieve single post by id from database
const getPostById = async (_id) => {
  
  const { db } = await connectToDatabase();

  const post = await db
    .collection("published_posts")
    .findOne({
      _id: ObjectID(_id)
    });

  return post;
}

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
}

// update a post
const updatePost = async (title,
  author,
  description,
  category, 
  tags,
  _id,
  id, 
  version, 
  rows) => {
  const { db } = await connectToDatabase();

  const data = {title,
    author,
    description,
    category, 
    tags,
    id, 
    version, 
    rows}
  const response = await db.collection("published_posts").updateOne({
    _id: ObjectID(_id)
  }, { $set: data })

  return data;

} 

//delete a post
const deletePost = async (_id) => {
  
  const { db } = await connectToDatabase();

  const deleted = await db
    .collection("published_posts")
    .deleteOne({
      _id: ObjectID(_id)
    });

  return deleted;
}

// add a draft to database with specific format from editor with id, version, and rows as input data.
const createDraft = async (title,
  author,
  description,
  category, 
  tags,
  id, 
  version, 
  rows) => {
  const { db } = await connectToDatabase();

  const data = {title,
    author,
    description,
    category, 
    tags,
    id, 
    version, 
    rows}
  const response = await db.collection("drafts").insertOne(data)

  return data;

} 

// query database to get all drafts by user

// UPDATE TO GETPOSTSBYUSER
const getDraftsByUser = async () => {
  
  const { db } = await connectToDatabase();

  const drafts = await db
    .collection("drafts")
    .find({})
    .limit(20)
    .toArray();

  return drafts;
}

// retrieve single draft by id from database
const getDraftById = async (id) => {
  
  const { db } = await connectToDatabase();

  const draft = await db
    .collection("drafts")
    .findOne({
      _id: ObjectID(id)
    });

  return draft;
}

//update a draft
const updateDraft = async ( title,
  author,
  description,
  category, 
  tags,
  _id,
  id, 
  version, 
  rows) => {
  const { db } = await connectToDatabase();

  const data = { 
    title,
  author,
  description,
  category, 
  tags,
  id, 
  version, 
  rows}
  const response = await db.collection("drafts").updateOne({
    _id: ObjectID(_id)
  }, { $set: data })

  return data;

}

//delete a draft
const deleteDraft = async (_id) => {
  
  const { db } = await connectToDatabase();

  const deleted = await db
    .collection("drafts")
    .deleteOne({
      _id: ObjectID(_id)
    });

  return deleted;
}


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
  deleteDraft
}

 

