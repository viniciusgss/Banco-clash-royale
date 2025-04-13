const mongoose = require("mongoose");

const BattleSchema = new mongoose.Schema(
  {
    battleTimeBegin: { type: Date, required: true },
    battleTimeEnd: { type: Date, required: true },
    battleType: { type: String, required: true },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    opponent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    playerDeck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BattleDeck",
      required: true,
    },
    opponentDeck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BattleDeck",
      required: true,
    },
    playerTrophyChange: { type: Number, default: 0 },
    opponentTrophyChange: { type: Number, default: 0 },
    playerTowersDestroyed: { type: Number, default: 0 },
    opponentTowersDestroyed: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Battle", BattleSchema);
