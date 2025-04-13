const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true },
    name: { type: String, required: true },
    trophies: { type: Number, default: 0 },
    bestTrophies: { type: Number, default: 0 },
    clan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clan",
      required: false,
    },
    cards: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Card", required: true },
    ],
    battleDecks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BattleDeck",
        required: true,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Player", playerSchema);
