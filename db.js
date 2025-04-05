// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);
const dbName = process.env.DB_NAME;

async function connectDB() {
  await client.connect();
  console.log("✅ Conectado ao MongoDB Atlas");
  return client.db(dbName);
}

module.exports = connectDB;
