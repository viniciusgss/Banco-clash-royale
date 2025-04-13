const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    id: { type: Number, required: true },
    maxLevel: { type: Number, required: true },
    maxEvolutionLevel: { type: Number, required: true },
    elixirCost: { type: Number, required: true },
    iconUrls: { type: Object, required: false },
    rarity: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Card", cardSchema);
