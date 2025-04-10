const mongoose = require("mongoose");

const clanSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  tag: { type: String, required: true },
  name: { type: String, required: true },
  badgeUrls: { type: Object, default: {} },
  clanLevel: { type: Number, default: 0 },
  clanPoints: { type: Number, default: 0 },
  members: { type: Number, default: 1 },
  requiredTrophies: { type: Number, default: 0 },
  location: { type: String, default: "" },
  description: { type: String, default: "" },
  type: { type: String, default: null },
});

module.exports = mongoose.model("Clan", clanSchema);
