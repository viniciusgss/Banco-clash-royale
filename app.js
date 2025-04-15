const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const uri = process.env.MONGODB_URI;
const dbName = "clashRoyaleDB";
const client = new MongoClient(uri + dbName);

async function connectDB() {
  try {
    await client.connect();
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  }
}

app.get('/api/consultas/1', async (req, res) => {
  try {
      const db = client.db(dbName);
      const battles = db.collection('battles');

      const consulta = await battles.aggregate([
          {
              $match: {
                  battleTimeBegin: { $gte: new Date("2025-04-01T00:00:00.000Z"), $lte: new Date("2025-04-30T23:59:59.999Z") }
              }
          },
          {
              $addFields: {
                  playerDeckId: { $toObjectId: "$playerDeck.$id" }
              }
          },
          {
              $lookup: {
                  from: 'battledecks',
                  localField: 'playerDeckId',
                  foreignField: '_id',
                  as: 'playerDeckData'
              }
          },
          { $unwind: '$playerDeckData' },
          {
              $match: {
                  'playerDeckData.cards': 'Hog Rider'
              }
          },
          {
              $group: {
                  _id: null,
                  totalPartidas: { $sum: 1 },
                  vitorias: {
                      $sum: {
                          $cond: [{ $gt: ['$playerTrophyChange', 0] }, 1, 0]
                      }
                  },
                  derrotas: {
                      $sum: {
                          $cond: [{ $lt: ['$playerTrophyChange', 0] }, 1, 0]
                      }
                  }
              }
          },
          {
              $project: {
                  _id: 0,
                  totalPartidas: 1,
                  porcentagemVitorias: {
                      $cond: [
                          { $eq: ['$totalPartidas', 0] },
                          0,
                          { $round: [{ $multiply: [{ $divide: ['$vitorias', '$totalPartidas'] }, 100] }, 2] }
                      ]
                  },
                  porcentagemDerrotas: {
                      $cond: [
                          { $eq: ['$totalPartidas', 0] },
                          0,
                          { $round: [{ $multiply: [{ $divide: ['$derrotas', '$totalPartidas'] }, 100] }, 2] }
                      ]
                  }
              }
          }
      ]).toArray();

      res.status(200).json(consulta);

  } catch (error) {
      console.error('Erro ao realizar consulta 1:', error);
      res.status(500).json({ message: 'Erro ao realizar consulta 1.' });
  } finally {
      // if (client) await client.close();
  }
});

app.get('/api/consultas/2', async (req, res) => {
  try {
      const db = client.db(dbName);
      const battles = db.collection('battles');

      const consulta = await battles.aggregate([
        {
          $match: {
            battleTimeBegin: {
              $gte: new Date("2025-04-01T00:00:00.000Z"),
              $lte: new Date("2025-04-30T23:59:59.999Z")
            }
          }
        },
        {
          $lookup: {
            from: "battledecks",
            localField: "playerDeck.$id",
            foreignField: "_id",
            as: "playerDeckData"
          }
        },
        { $unwind: "$playerDeckData" },
        {
          $group: {
            _id: "$playerDeckData.cards",
            totalPartidas: { $sum: 1 },
            vitorias: {
              $sum: { $cond: [{ $gt: ["$playerTrophyChange", 0] }, 1, 0] }
            }
          }
        },
        {
          $addFields: {
            porcentagemVitorias: {
              $cond: [
                { $eq: ["$totalPartidas", 0] },
                0,
                { $round: [{ $multiply: [{ $divide: ["$vitorias", "$totalPartidas"] }, 100] }, 2] }
              ]
            }
          }
        },
        { $match: { porcentagemVitorias: { $gt: 40 } } },
        {
          $project: {
            deck: "$_id",
            totalPartidas: 1,
            vitorias: 1,
            porcentagemVitorias: 1,
            _id: 0
          }
        },
        { $sort: { porcentagemVitorias: -1 } }
      ]).toArray();
      res.status(200).json(consulta);
  } catch (error) {
      console.error('Erro ao realizar consulta 2:', error);
      res.status(500).json({ message: 'Erro ao realizar consulta 2.' });
  } finally {
      // if (client) await client.close();
  }
});

app.get('/api/consultas/3', async (req, res) => {
  try {
      const db = client.db(dbName);
      const battles = db.collection('battles');

      const consulta = await battles.aggregate([
        {
          $match: {
            battleTimeBegin: {
              $gte: new Date("2025-04-01T00:00:00.000Z"),
              $lte: new Date("2025-04-30T23:59:59.999Z")
            }
          }
        },
        {
          $lookup: {
            from: "battledecks",
            localField: "playerDeck.$id",
            foreignField: "_id",
            as: "playerDeckData"
          }
        },
        { $unwind: "$playerDeckData" },
        {
          $match: {
            "playerDeckData.cards": {
              $all: ["Fireball", "Zap"]
            }
          }
        },
        {
          $group: {
            _id: null,
            totalDerrotas: {
              $sum: { $cond: [{ $lt: ["$playerTrophyChange", 0] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            _id: 0,
            combo: ["Fireball", "Zap"],
            totalDerrotas: 1
          }
        }
      ]).toArray();
      res.status(200).json(consulta);
  } catch (error) {
      console.error('Erro ao realizar consulta 3:', error);
      res.status(500).json({ message: 'Erro ao realizar consulta 3.' });
  } finally {
      // if (client) await client.close();
  }
});

app.get('/api/consultas/4', async (req, res) => {
  try {
      const db = client.db(dbName);
      const battles = db.collection('battles');

      const consulta = await battles.aggregate([
        { $match: { playerTrophyChange: { $gt: 0 } } },
        { $lookup: { from: "battledecks", localField: "playerDeck.$id", foreignField: "_id", as: "playerDeckData" } },
        { $match: { "playerDeckData": { $ne: [] } } },
        { $unwind: "$playerDeckData" },
        { $match: { "playerDeckData.cards": "Fireball" } },
        { $group: { _id: null, totalVitorias: { $sum: 1 } } },
        { $project: { _id: 0, carta: "Fireball", totalVitorias: 1 } }
      ]).toArray();
      res.status(200).json(consulta);
  } catch (error) {
      console.error('Erro ao realizar consulta 4:', error);
      res.status(500).json({ message: 'Erro ao realizar consulta 4.' });
  } finally {
      // if (client) await client.close();
  }
});

app.get('/api/consultas/5', async (req, res) => {
  try {
      const db = client.db(dbName);
      const battles = db.collection('battles');

      const consulta = await battles.aggregate([
        {
          $match: {
            battleTimeBegin: {
              $gte: new Date("2025-04-01T00:00:00.000Z"),
              $lte: new Date("2025-04-30T23:59:59.999Z")
            }
          }
        },
        {
          $lookup: {
            from: "battledecks",
            localField: "playerDeck.$id",
            foreignField: "_id",
            as: "playerDeckData"
          }
        },
        { $unwind: "$playerDeckData" },
        {
          $match: {
            "playerDeckData": { $ne: [] }
          }
        },
        {
          $set: {
            cards: "$playerDeckData.cards"
          }
        },
        // Gerar pares de cartas (N=2)
        {
          $set: {
            combos: {
              $reduce: {
                input: "$cards",
                initialValue: [],
                in: {
                  $concatArrays: [
                    "$$value",
                    {
                      $map: {
                        input: { $slice: ["$cards", { $add: [{ $indexOfArray: ["$cards", "$$this"] }, 1] }, 999] },
                        as: "nextCard",
                        in: { $sortArray: { input: ["$$this", "$$nextCard"], sortBy: 1 } }
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        { $unwind: "$combos" },
        // Agrupar por combo
        {
          $group: {
            _id: "$combos",
            totalPartidas: { $sum: 1 },
            vitorias: {
              $sum: { $cond: [{ $gt: ["$playerTrophyChange", 0] }, 1, 0] }
            }
          }
        },
        // Calcular taxa de vitórias
        {
          $set: {
            porcentagemVitorias: {
              $cond: [
                { $eq: ["$totalPartidas", 0] },
                0,
                { $round: [{ $multiply: [{ $divide: ["$vitorias", "$totalPartidas"] }, 100] }, 2] }
              ]
            }
          }
        },
        // Filtrar combos com > Y%
        {
          $match: {
            porcentagemVitorias: { $gt: 50 }
          }
        },
        // Projetar resultado
        {
          $project: {
            _id: 0,
            combo: "$_id",
            totalPartidas: 1,
            vitorias: 1,
            porcentagemVitorias: 1
          }
        },
        // Ordenar por taxa de vitórias
        { $sort: { porcentagemVitorias: -1 } }
      ]).toArray();
      res.status(200).json(consulta);
  } catch (error) {
      console.error('Erro ao realizar consulta 5:', error);
      res.status(500).json({ message: 'Erro ao realizar consulta 5.' });
  } finally {
      // if (client) await client.close();
  }
});

app.get('/api/consultas/6', async (req, res) => {
  try {
      const db = client.db(dbName);
      const battles = db.collection('battles');

      const consulta = await battles.aggregate([
        {
          $match: {
            battleTimeBegin: {
              $gte: new Date("2025-04-01T00:00:00.000Z"),
              $lte: new Date("2025-04-30T23:59:59.999Z")
            }
          }
        },
        {
          $lookup: {
            from: "battledecks",
            localField: "playerDeck.$id",
            foreignField: "_id",
            as: "playerDeckData"
          }
        },
        { $unwind: "$playerDeckData" },
        {
          $match: {
            "playerDeckData": { $ne: [] }
          }
        },
        // Desaninhar cartas para agrupar por carta
        { $unwind: "$playerDeckData.cards" },
        // Agrupar por carta, coletando baralhos completos
        {
          $group: {
            _id: "$playerDeckData.cards",
            decks: {
              $addToSet: {
                deck: "$playerDeckData.cards", // Usa o baralho completo
                partidas: { $sum: 1 }
              }
            }
          }
        },
        // Reestruturar decks para somar partidas de baralhos iguais
        {
          $set: {
            decks: {
              $reduce: {
                input: "$decks",
                initialValue: [],
                in: {
                  $cond: [
                    { $in: ["$$this.deck", "$$value.deck"] },
                    {
                      $map: {
                        input: "$$value",
                        as: "d",
                        in: {
                          $cond: [
                            { $eq: ["$$d.deck", "$$this.deck"] },
                            {
                              deck: "$$d.deck",
                              partidas: { $add: ["$$d.partidas", "$$this.partidas"] }
                            },
                            "$$d"
                          ]
                        }
                      }
                    },
                    { $concatArrays: ["$$value", ["$$this"]] }
                  ]
                }
              }
            }
          }
        },
        // Ordenar baralhos por partidas
        {
          $set: {
            decks: {
              $sortArray: {
                input: "$decks",
                sortBy: { partidas: -1 }
              }
            }
          }
        },
        // Projetar resultado
        {
          $project: {
            _id: 0,
            carta: "$_id",
            decks: 1
          }
        },
        // Ordenar por carta
        { $sort: { carta: 1 } }
      ]).toArray();
      res.status(200).json(consulta);
  } catch (error) {
      console.error('Erro ao realizar consulta 7:', error);
      res.status(500).json({ message: 'Erro ao realizar consulta 7.' });
  } finally {
      // if (client) await client.close();
  }
});

app.get('/api/consultas/7', async (req, res) => {
  try {
      const db = client.db(dbName);
      const battles = db.collection('battles');

      const consulta = await battles.aggregate([
        {
          $match: {
            battleTimeBegin: {
              $gte: new Date("2025-04-01T00:00:00.000Z"),
              $lte: new Date("2025-04-30T23:59:59.999Z")
            },
            battleTimeEnd: { $exists: true }
          }
        },
        {
          $set: {
            durationSeconds: {
              $divide: [
                { $subtract: ["$battleTimeEnd", "$battleTimeBegin"] },
                1000
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            totalBatalhas: { $sum: 1 },
            averageDuration: { $avg: "$durationSeconds" }
          }
        },
        {
          $project: {
            _id: 0,
            totalBatalhas: 1,
            averageDuration: { $round: ["$averageDuration", 2] }
          }
        }
      ]).toArray();
      res.status(200).json(consulta);
  } catch (error) {
      console.error('Erro ao realizar consulta 7:', error);
      res.status(500).json({ message: 'Erro ao realizar consulta 7.' });
  } finally {
      // if (client) await client.close();
  }
});

app.get('/api/consultas/8', async (req, res) => {
  try {
      const db = client.db(dbName);
      const battles = db.collection('battles');

      const consulta = await battles.aggregate([
        {
          $match: {
            battleTimeBegin: {
              $gte: new Date("2025-04-01T00:00:00.000Z"),
              $lte: new Date("2025-04-30T23:59:59.999Z")
            },
            playerTrophyChange: { $gt: 0 }
          }
        },
        {
          $lookup: {
            from: "battledecks",
            localField: "playerDeck.$id",
            foreignField: "_id",
            as: "playerDeckData"
          }
        },
        { $unwind: "$playerDeckData" },
        {
          $match: {
            "playerDeckData": { $ne: [] }
          }
        },
        { $unwind: "$playerDeckData.cards" },
        {
          $group: {
            _id: {
              carta: "$playerDeckData.cards",
              player: "$player"
            },
            vitorias: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: "$_id.carta",
            topPlayers: {
              $push: {
                player: "$_id.player",
                vitorias: "$vitorias"
              }
            }
          }
        },
        {
          $set: {
            topPlayers: {
              $slice: [
                { $sortArray: { input: "$topPlayers", sortBy: { vitorias: -1 } } },
                5
              ]
            }
          }
        },
        {
          $project: {
            _id: 0,
            carta: "$_id",
            topPlayers: 1
          }
        },
        { $sort: { carta: 1 } }
      ]).toArray();
      res.status(200).json(consulta);
  } catch (error) {
      console.error('Erro ao realizar consulta 8:', error);
      res.status(500).json({ message: 'Erro ao realizar consulta 8.' });
  } finally {
      // if (client) await client.close();
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});