const mongoose = require("mongoose");

const battleDeckSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
        required: true,
      },
    ],
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    elixircost_med: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BattleDeck", battleDeckSchema);
