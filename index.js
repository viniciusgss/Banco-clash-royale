// index.js
require('dotenv').config(); // <- Sempre no topo do arquivo

const axios = require('axios');
const connectDB = require('./db');

const playerTag = '9QJ2ULRL'; // Substitua por uma tag válida

async function getPlayerData() {
  try {
    const response = await axios.get(`https://api.clashroyale.com/v1/players/%23${playerTag}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`
      }
    });

    const db = await connectDB();
    const playersCollection = db.collection('players');
    await playersCollection.insertOne(response.data);

    console.log("✅ Dados do jogador salvos com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao buscar ou salvar dados:", err.message);
  }
}

getPlayerData();
