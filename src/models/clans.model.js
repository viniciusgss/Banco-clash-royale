const { ObjectId } = require("mongodb");
const connectDB = require("../config/database.js");
const db = connectDB();

const collection = await db.collection("clans");

async function getClans() {
    return collection.find();
  }

async function getClanById(tag) {
    if (tag.length >= 2) {
        throw new Error("Tag inválido");
    }
  return collection.findOne({ tag: tag });
}


module.exports = {
    getClans,
    getClanById,
};
