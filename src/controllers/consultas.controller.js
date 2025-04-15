const Battles = require("../models/battles.model");
const Cards = require("../models/cards.model");

// Consulta 1
exports.consulta1 = async (req, res) => {
  try {
    const { Carta, DataInicio, DataFim } = req.query;
    if (!Carta || !DataInicio || !DataFim) {
      return res
        .status(400)
        .json({ message: "Parâmetros obrigatórios ausentes." });
    }

    const carta = await Cards.findOne({ id: Carta });
    if (!carta)
      return res.status(404).json({ message: "Carta não encontrada." });

    const consulta = await Battles.aggregate([
      {
        $match: {
          battleTime: { $gte: new Date(DataInicio), $lte: new Date(DataFim) },
        },
      },
      {
        $lookup: {
          from: "battledecks",
          localField: "playerDeck",
          foreignField: "_id",
          as: "playerDeckData",
        },
      },
      { $unwind: "$playerDeckData" },
      { $match: { "playerDeckData.cards": carta._id } },
      {
        $group: {
          _id: null,
          totalPartidas: { $sum: 1 },
          vitorias: {
            $sum: { $cond: [{ $gt: ["$playerTrophyChange", 0] }, 1, 0] },
          },
          derrotas: {
            $sum: { $cond: [{ $lt: ["$playerTrophyChange", 0] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalPartidas: 1,
          porcentagemVitorias: {
            $cond: [
              { $eq: ["$totalPartidas", 0] },
              0,
              {
                $multiply: [{ $divide: ["$vitorias", "$totalPartidas"] }, 100],
              },
            ],
          },
          porcentagemDerrotas: {
            $cond: [
              { $eq: ["$totalPartidas", 0] },
              0,
              {
                $multiply: [{ $divide: ["$derrotas", "$totalPartidas"] }, 100],
              },
            ],
          },
        },
      },
    ]);

    if (consulta.length === 0)
      return res.status(404).json({ message: "Nenhuma partida encontrada." });
    res.status(200).json(consulta[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao realizar consulta 1." });
  }
};

// Consulta 2
exports.consulta2 = async (req, res) => {
  try {
    const { porcentagemProcurada, DataInicio, DataFim } = req.query;
    const porcentagem = parseFloat(porcentagemProcurada);

    const consulta = await Battles.aggregate([
      {
        $match: {
          battleTime: { $gte: new Date(DataInicio), $lte: new Date(DataFim) },
        },
      },
      {
        $lookup: {
          from: "battledecks",
          localField: "playerDeck",
          foreignField: "_id",
          as: "playerDeckData",
        },
      },
      { $unwind: "$playerDeckData" },
      {
        $group: {
          _id: "$playerDeckData.cards",
          totalPartidas: { $sum: 1 },
          vitorias: {
            $sum: { $cond: [{ $gt: ["$playerTrophyChange", 0] }, 1, 0] },
          },
        },
      },
      {
        $addFields: {
          porcentagemVitorias: {
            $cond: [
              { $eq: ["$totalPartidas", 0] },
              0,
              {
                $multiply: [{ $divide: ["$vitorias", "$totalPartidas"] }, 100],
              },
            ],
          },
        },
      },
      { $match: { porcentagemVitorias: { $gt: porcentagem } } },
      {
        $project: {
          deck: "$_id",
          totalPartidas: 1,
          vitorias: 1,
          porcentagemVitorias: 1,
        },
      },
      { $sort: { porcentagemVitorias: -1 } },
    ]);

    if (consulta.length === 0)
      return res
        .status(404)
        .json({
          message: "Nenhum deck encontrado com a porcentagem desejada.",
        });
    res.status(200).json(consulta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao realizar consulta 2." });
  }
};

// Consulta 3
exports.consulta3 = async (req, res) => {
  try {
    const { cartas, DataInicio, DataFim } = req.query;
    const cartasArray = cartas.split(",").map(Number);

    const consulta = await Battles.aggregate([
      {
        $match: {
          battleTime: { $gte: new Date(DataInicio), $lte: new Date(DataFim) },
        },
      },
      {
        $lookup: {
          from: "battledecks",
          localField: "playerDeck",
          foreignField: "_id",
          as: "playerDeckData",
        },
      },
      { $unwind: "$playerDeckData" },
      { $match: { "playerDeckData.cards": { $all: cartasArray } } },
      {
        $group: {
          _id: null,
          totalDerrotas: {
            $sum: { $cond: [{ $lt: ["$playerTrophyChange", 0] }, 1, 0] },
          },
        },
      },
      { $project: { _id: 0, totalDerrotas: 1 } },
    ]);

    if (consulta.length === 0)
      return res
        .status(404)
        .json({ message: "Nenhuma derrota encontrada com esse combo." });
    res.status(200).json(consulta[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao realizar consulta 3." });
  }
};

// Consulta 4
exports.consulta4 = async (req, res) => {
  try {
    const { carta, porcentagemTrofeusamenos } = req.query;
    if (!carta || !porcentagemTrofeusamenos) {
      return res
        .status(400)
        .json({ message: "Carta e porcentagem são obrigatórias" });
    }

    const multiplicador = 1 - parseFloat(porcentagemTrofeusamenos) / 100;

    const consulta = await Battles.aggregate([
      {
        $match: {
          $expr: {
            $lt: [
              { $subtract: ["$battleTimeEnd", "$battleTimeBegin"] },
              120000,
            ],
          },
          playerTrophyChange: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: "battledecks",
          localField: "playerDeck",
          foreignField: "_id",
          as: "playerDeckData",
        },
      },
      { $unwind: "$playerDeckData" },
      { $match: { "playerDeckData.cards": parseInt(carta) } },
      {
        $lookup: {
          from: "players",
          localField: "player",
          foreignField: "_id",
          as: "playerData",
        },
      },
      { $unwind: "$playerData" },
      {
        $lookup: {
          from: "players",
          localField: "opponent",
          foreignField: "_id",
          as: "opponentData",
        },
      },
      { $unwind: "$opponentData" },
      {
        $match: {
          $expr: {
            $and: [
              {
                $lte: [
                  "$playerData.trophies",
                  { $multiply: ["$opponentData.trophies", multiplicador] },
                ],
              },
              { $gte: ["$opponentTowersDestroyed", 2] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalVitorias: { $sum: 1 },
        },
      },
      { $project: { _id: 0, totalVitorias: 1 } },
    ]);

    if (consulta.length === 0)
      return res
        .status(404)
        .json({ message: "Nenhuma vitória encontrada com esses critérios" });
    res.status(200).json(consulta[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao realizar consulta 4." });
  }
};

// Consulta 5
exports.consulta5 = async (req, res) => {
  try {
    const { tamanhoCombo, percentualMinimo, inicio, fim } = req.query;
    const comboSize = parseInt(tamanhoCombo);
    const minPercent = parseFloat(percentualMinimo);

    const pipeline = [
      {
        $match: {
          battleTimeBegin: { $gte: new Date(inicio), $lte: new Date(fim) },
          playerTrophyChange: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: "battledecks",
          localField: "playerDeck",
          foreignField: "_id",
          as: "deck",
        },
      },
      { $unwind: "$deck" },
      {
        $lookup: {
          from: "cards",
          localField: "deck.cards",
          foreignField: "_id",
          as: "deckCards",
        },
      },
      {
        $project: {
          combo: {
            $map: { input: "$deckCards", as: "card", in: "$$card.name" },
          },
        },
      },
      {
        $project: {
          combinations: {
            $function: {
              body: function (cards, size) {
                const results = [];
                const combine = (start, path) => {
                  if (path.length === size) {
                    results.push(path.slice().sort().join(", "));
                    return;
                  }
                  for (let i = start; i < cards.length; i++) {
                    path.push(cards[i]);
                    combine(i + 1, path);
                    path.pop();
                  }
                };
                combine(0, []);
                return results;
              },
              args: ["$combo", comboSize],
              lang: "js",
            },
          },
        },
      },
      { $unwind: "$combinations" },
      { $group: { _id: "$combinations", vitorias: { $sum: 1 } } },
      {
        $project: {
          _id: 1,
          vitorias: 1,
          porcentagem: {
            $multiply: [
              { $divide: ["$vitorias", { $size: "$combinations" }] },
              100,
            ],
          },
        },
      },
      { $match: { porcentagem: { $gte: minPercent } } },
      { $sort: { porcentagem: -1 } },
    ];

    const resultado = await Battles.aggregate(pipeline);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao realizar consulta 5." });
  }
};

// Consulta 6
// Consulta 6 - Melhorada
exports.consulta6 = async (req, res) => {
  try {
    const resultado = await Battles.aggregate([
      { $unwind: "$deck" }, // Decompor o deck em múltiplos documentos
      {
        $group: {
          _id: { carta: "$deck", deckName: "$deckName" },
          aparicoes: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.carta",
          decks: {
            $push: {
              deckName: "$_id.deckName",
              aparicoes: "$aparicoes",
            },
          },
        },
      },
      {
        $project: {
          carta: "$_id",
          decks: {
            $slice: [
              { $sort: { input: "$decks", sortBy: { aparicoes: -1 } } }, // Ordena os decks pelo número de aparições
              5, // Pega apenas os 5 decks mais populares
            ],
          },
          _id: 0,
        },
      },
    ]);

    res.status(200).json({ baralhosPopularesPorCarta: resultado });
  } catch (error) {
    res.status(500).json({ message: "Erro na consulta 6." });
  }
};

// Consulta 7
// Consulta 7 - Melhorada
exports.consulta7 = async (req, res) => {
  try {
    const resultado = await Battles.aggregate([
      {
        $group: {
          _id: null,
          mediaDuracao: { $avg: "$duration" },
        },
      },
      {
        $project: {
          _id: 0,
          mediaDuracao: {
            $cond: [
              { $eq: ["$mediaDuracao", null] }, // Verifica se a média é nula
              0,
              { $round: ["$mediaDuracao", 2] }, // Arredonda para 2 casas decimais
            ],
          },
        },
      },
    ]);

    res.status(200).json({ duracaoMedia: resultado[0]?.mediaDuracao || 0 });
  } catch (error) {
    res.status(500).json({ message: "Erro na consulta 7." });
  }
};

exports.consulta8 = async (req, res) => {
  try {
    const resultado = await Battles.aggregate([
      { $match: { playerTrophyChange: { $gt: 0 } } }, // Filtra apenas as vitórias
      { $unwind: "$deck" }, // Decompõe o deck em múltiplos documentos
      {
        $group: {
          _id: { carta: "$deck", jogador: "$playerTag" },
          vitorias: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "players",
          localField: "_id.jogador",
          foreignField: "tag",
          as: "player",
        },
      },
      { $unwind: "$player" }, // Garante que a referência do jogador esteja disponível
      {
        $group: {
          _id: "$_id.carta",
          jogadores: {
            $push: {
              nome: "$player.name",
              tag: "$_id.jogador",
              vitorias: "$vitorias",
            },
          },
        },
      },
      {
        $project: {
          carta: "$_id",
          jogadores: {
            $slice: [
              { $sort: { input: "$jogadores", sortBy: { vitorias: -1 } } }, // Ordena os jogadores pelas vitórias
              3, // Pega os 3 jogadores com mais vitórias
            ],
          },
          _id: 0,
        },
      },
    ]);

    if (resultado.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum jogador com vitórias encontrado." });
    }

    res.status(200).json({ melhoresJogadoresPorCarta: resultado });
  } catch (error) {
    res.status(500).json({ message: "Erro na consulta 8." });
  }
};
