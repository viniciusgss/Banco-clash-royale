const Battles = require("../models/battles.model");
const Cards = require("../models/cards.model");

exports.consulta1 = async (req, res) => {
  try {
    const { Carta, DataInicio, DataFim } = req.query;
    const carta = Cards.findOne({ id: Carta });
    if (!carta) {
      return res.status(404).json({ message: "Carta não encontrada" });
    }
    if (!DataInicio || !DataFim) {
      return res.status(400).json({ message: "Data de início e fim são obrigatórias" });
    }
    const consulta = await Battles.aggregate([
      {
        // Filtra pelo intervalo de timestamps
        $match: {
          battleTime: {
            $gte: ISODate(DataInicio), // Início
            $lte: ISODate(DataFim)  // Fim
          }
        }
      },
      {
        // Faz o lookup para trazer os dados do playerDeck
        $lookup: {
          from: "battledecks", // Nome da coleção BattleDeck
          localField: "playerDeck",
          foreignField: "_id",
          as: "playerDeckData"
        }
      },
      {
        // Desconstrói o array playerDeckData
        $unwind: "$playerDeckData"
      },
      {
        // Filtra partidas onde cartaX está no deck do jogador
        $match: {
          "playerDeckData.cards": carta // Carta específica
        }
      },
      {
        // Agrupa para contar vitórias, derrotas e total
        $group: {
          _id: null,
          totalPartidas: { $sum: 1 },
          vitorias: {
            $sum: {
              $cond: [{ $gt: ["$playerTrophyChange", 0] }, 1, 0]
            }
          },
          derrotas: {
            $sum: {
              $cond: [{ $lt: ["$playerTrophyChange", 0] }, 1, 0]
            }
          }
        }
      },
      {
        // Calcula as porcentagens
        $project: {
          totalPartidas: 1,
          porcentagemVitorias: {
            $cond: [
              { $eq: ["$totalPartidas", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$vitorias", "$totalPartidas"] },
                  100
                ]
              }
            ]
          },
          porcentagemDerrotas: {
            $cond: [
              { $eq: ["$totalPartidas", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$derrotas", "$totalPartidas"] },
                  100
                ]
              }
            ]
          }
        }
      }
    ]);
    if (!consulta) {
      return res.status(404).json({ message: "Erro na Consulta" });
    }
    res.status(200).json(consulta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao realizar consulta" });
  }
};

exports.consulta2 = async (req, res) => {
  try {
    const { porcentagemProcurada, DataInicio, DataFim } = req.query;
    const consulta = await Battles.aggregate([
  {
    // Filtra pelo intervalo de timestamps
    $match: {
      battleTime: {
        $gte: ISODate(DataInicio), // Início
        $lte: ISODate(DataFim)  // Fim
      }
    }
  },
  {
    // Faz o lookup para trazer os dados do playerDeck
    $lookup: {
      from: "battledecks", // Nome da coleção BattleDeck
      localField: "playerDeck",
      foreignField: "_id",
      as: "playerDeckData"
    }
  },
  {
    // Desconstrói o array playerDeckData
    $unwind: "$playerDeckData"
  },
  {
    // Agrupa por deck completo (array de cartas)
    $group: {
      _id: "$playerDeckData.cards", // Agrupa pelo array completo de cartas
      totalPartidas: { $sum: 1 },
      vitorias: {
        $sum: {
          $cond: [{ $gt: ["$playerTrophyChange", 0] }, 1, 0]
        }
      }
    }
  },
  {
    // Calcula a porcentagem de vitórias e filtra por X%
    $match: {
      $expr: {
        $gt: [
          {
            $multiply: [
              { $divide: ["$vitorias", "$totalPartidas"] },
              100
            ]
          },
          porcentagemProcurada // Parâmetro X (ex.: 60%)
        ]
      }
    }
  },
  {
    // Formata a saída
    $project: {
      _id: 0,
      deck: "$_id", // Lista de cartas do deck
      totalPartidas: 1,
      vitorias: 1,
      porcentagemVitorias: {
        $multiply: [
          { $divide: ["$vitorias", "$totalPartidas"] },
          100
        ]
      }
    }
  },
  {
    // Opcional: ordena por porcentagem de vitórias (descendente)
    $sort: {
      porcentagemVitorias: -1
    }
  }
    ]);
    if (!consulta) {
      return res.status(404).json({ message: "Erro na Consulta" });
    }
    res.status(200).json(consulta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao realizar consulta" });
  }
};

exports.consulta3 = async (req, res) => {
  try {
    const { cartas, DataInicio, DataFim } = req.query;
    const cartasArray = cartas.split(",").map(Number); // Converte a string em um array de números
    const consulta = await Battles.aggregate([
      {
        // Filtra pelo intervalo de timestamps
        $match: {
          battleTime: {
            $gte: ISODate(DataInicio), // Início
            $lte: ISODate(DataFim)  // Fim
          }
        }
      },
      {
        // Faz o lookup para trazer os dados do playerDeck
        $lookup: {
          from: "battledecks", // Nome da coleção BattleDeck
          localField: "playerDeck",
          foreignField: "_id",
          as: "playerDeckData"
        }
      },
      {
        // Desconstrói o array playerDeckData
        $unwind: "$playerDeckData"
      },
      {
        // Filtra partidas onde todas as cartas do combo estão no deck
        $match: {
          "playerDeckData.cards": {
            $all: cartasArray // Combo de cartas
          }
        }
      },
      {
        // Agrupa para contar derrotas
        $group: {
          _id: null,
          totalDerrotas: {
            $sum: {
              $cond: [{ $lt: ["$playerTrophyChange", 0] }, 1, 0]
            }
          }
        }
      },
      {
        // Formata a saída
        $project: {
          _id: 0,
          totalDerrotas: 1
        }
      }
    ]);
    if (!consulta) {
      return res.status(404).json({ message: "Erro na Consulta" });
    }
    res.status(200).json(consulta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao realizar consulta" });
  }
}

exports.consulta4 = async (req, res) => {
  try {
    const { carta, porcentagemTrofeusamenos } = req.query;
    const consulta = await Battles.aggregate([
      {
        // Filtra por duração < 2 minutos e vitórias
        $match: {
          $expr: {
            // Duração < 120 segundos (2 minutos)
            $lt: [
              { $subtract: ["$battleTimeEnd", "$battleTimeBegin"] },
              120000 // 120 segundos em milissegundos
            ]
          },
          playerTrophyChange: { $gt: 0 } // Jogador venceu
        }
      },
      {
        // Faz o lookup para trazer os dados do playerDeck
        $lookup: {
          from: "battledecks",
          localField: "playerDeck",
          foreignField: "_id",
          as: "playerDeckData"
        }
      },
      {
        // Desconstrói o array playerDeckData
        $unwind: "$playerDeckData"
      },
      {
        // Filtra partidas com a carta X no deck do vencedor
        $match: {
          "playerDeckData.cards": carta // Carta específica
        }
      },
      {
        // Faz o lookup para trazer os troféus do jogador (vencedor)
        $lookup: {
          from: "players",
          localField: "player",
          foreignField: "_id",
          as: "playerData"
        }
      },
      {
        // Desconstrói o array playerData
        $unwind: "$playerData"
      },
      {
        // Faz o lookup para trazer os troféus do oponente (perdedor)
        $lookup: {
          from: "players",
          localField: "opponent",
          foreignField: "_id",
          as: "opponentData"
        }
      },
      {
        // Desconstrói o array opponentData
        $unwind: "$opponentData"
      },
      {
        // Filtra onde o vencedor tem Z% menos troféus e o perdedor derrubou >= 2 torres
        $match: {
          $expr: {
            $and: [
              // Vencedor tem no máximo (1 - Z/100) * troféus do perdedor
              { $lte: ["$playerData.trophies", { $multiply: ["$opponentData.trophies", 0.8] }] }, // Z = 20%
              // Perdedor derrubou pelo menos 2 torres
              { $gte: ["$opponentTowersDestroyed", 2] }
            ]
          }
        }
      },
      {
        // Conta o total de vitórias
        $group: {
          _id: null,
          totalVitorias: { $sum: 1 }
        }
      },
      {
        // Formata a saída
        $project: {
          _id: 0,
          totalVitorias: 1
        }
      }
    ]);
    if (!consulta) {
      return res.status(404).json({ message: "Erro na Consulta" });
    }
    res.status(200).json(consulta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao realizar consulta" });
  }
}