const { MongoClient } = require('mongodb');
const connectDB = require("../config/database.js");
const db = connectDB();

async function createBattleCollection() {
    try {
        await client.connect();
        const database = client.db('your_database_name');
        const battles = database.collection('battles');
        const battleSchema = {
            _id: { type: ObjectId, auto: true },
            clan1: { type: ObjectId, ref: 'clans' },
            clan2: { type: ObjectId, ref: 'clans' },
            winner: { type: ObjectId, ref: 'clans' },
            date: { type: Date, default: Date.now },
            status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
        };
        await battles.createIndex({ clan1: 1, clan2: 1 }, { unique: true });
        console.log("Battle collection created successfully!");

module.exports = { createBattleCollection };