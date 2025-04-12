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
    if (consulta.length === 0) {
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
    if (consulta.length === 0) {
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
    if (consulta.length === 0) {
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
    if (!carta || !porcentagemTrofeusamenos) {
      return res.status(400).json({ message: "Carta e porcentagem são obrigatórias" });
    }
    // Converte para número e calcula o multiplicador
    const percentual = parseFloat(porcentagemTrofeusamenos) / 100;
    const multiplicador = 1 - percentual;

    const consulta = await Battles.aggregate([
      {
        $match: {
          $expr: {
            $lt: [
              { $subtract: ["$battleTimeEnd", "$battleTimeBegin"] },
              120000
            ]
          },
          playerTrophyChange: { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: "battledecks",
          localField: "playerDeck",
          foreignField: "_id",
          as: "playerDeckData"
        }
      },
      { $unwind: "$playerDeckData" },
      {
        $match: {
          "playerDeckData.cards": carta
        }
      },
      {
        $lookup: {
          from: "players",
          localField: "player",
          foreignField: "_id",
          as: "playerData"
        }
      },
      { $unwind: "$playerData" },
      {
        $lookup: {
          from: "players",
          localField: "opponent",
          foreignField: "_id",
          as: "opponentData"
        }
      },
      { $unwind: "$opponentData" },
      {
        $match: {
          $expr: {
            $and: [
              {
                $lte: [
                  "$playerData.trophies",
                  { $multiply: ["$opponentData.trophies", multiplicador] }
                ]
              },
              { $gte: ["$opponentTowersDestroyed", 2] }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalVitorias: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          totalVitorias: 1
        }
      }
    ]);

    if (consulta.length === 0) {
      return res.status(404).json({ message: "Nenhuma vitória encontrada com esses critérios" });
    }

    res.status(200).json(consulta[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao realizar consulta" });
  }
};

const getCombinations = (arr, k) => {
  const results = [];
  const backtrack = (start, path) => {
    if (path.length === k) {
      results.push([...path]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      path.push(arr[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  };
  backtrack(0, []);
  return results;
};

exports.consulta5 = async (req, res) => {
  try {
    const { tamanhoCombo, percentualMinimo, inicio, fim } = req.query;

    const comboSize = parseInt(tamanhoCombo);
    const minPercent = parseFloat(percentualMinimo);
    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);

    // Busca batalhas vencidas no intervalo
    const batalhas = await Battles.find({
      battleTimeBegin: { $gte: inicioDate, $lte: fimDate },
      playerTrophyChange: { $gt: 0 } // vitórias
    }).populate({
      path: "playerDeck",
      populate: { path: "cards" }
    });

    const totalVitorias = batalhas.length;
    const contadorCombos = {};

    for (const batalha of batalhas) {
      const cartas = batalha.playerDeck.cards.map(card => card.name).sort();
      const combinacoes = getCombinations(cartas, comboSize);
      combinacoes.forEach(combo => {
        const key = combo.join(", ");
        contadorCombos[key] = (contadorCombos[key] || 0) + 1;
      });
    }

    const resultado = Object.entries(contadorCombos)
      .map(([combo, count]) => ({
        combo,
        vitorias: count,
        percentual: ((count / totalVitorias) * 100).toFixed(2)
      }))
      .filter(item => item.percentual >= minPercent)
      .sort((a, b) => b.vitorias - a.vitorias);

    res.status(200).json({
      totalVitorias,
      combosRelevantes: resultado
    });

  } catch (error) {
    console.error("Erro na consulta6:", error);
    res.status(500).json({ message: "Erro ao executar consulta6" });
  }
};

