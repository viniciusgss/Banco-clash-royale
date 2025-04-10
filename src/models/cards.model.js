const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    id: { type: Number, required: true },
    maxLevel: { type: Number, required: true },
    maxEvolutionLevel: { type: Number, required: true },
    elixirCost: { type: Number, required: true },
    iconUrls: { type: Object, required: false }, // Adjust based on the structure of `iconUrls`
    rarity: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Card", cardSchema);
