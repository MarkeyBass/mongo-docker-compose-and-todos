import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGO_URL || "mongodb://admin:password123@localhost:27018/todos?authSource=admin";
const DB_NAME = "todos";

let client = null;
let db = null;

export async function initDb() {
  try {
    client = new MongoClient(MONGO_URL);
    await client.connect();
    db = client.db(DB_NAME);
    
    const todosCollection = db.collection('todos');
    
    // Create the unique index on title
    await todosCollection.createIndex({ title: 1 }, { unique: true });
    
    console.log("Database initialized and unique index created on 'title' field");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

export async function getDb() {
  if (!db) {
    if (!client) {
      client = new MongoClient(MONGO_URL);
      await client.connect();
    }
    db = client.db(DB_NAME);
  }
  return db;
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

