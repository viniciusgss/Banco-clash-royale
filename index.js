// index.js
require('dotenv').config(); // <- Sempre no topo do arquivo

const axios = require('axios');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com o banco de dados
const connectDB = require('./db');

// Middleware para JSON
app.use(express.json());

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

// Rota para buscar dados do jogador
app.get('/api/player/:tag', async (req, res) => {
  const playerTag = req.params.tag;

  try {
    const db = await connectDB();
    const playersCollection = db.collection('players');
    const playerData = await playersCollection.findOne({ tag: `#${playerTag}` });

    if (!playerData) {
      return res.status(404).json({ message: 'Jogador não encontrado.' });
    }

    res.json(playerData);
  } catch (err) {
    console.error("❌ Erro ao buscar dados do jogador:", err.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

getPlayerData();
