const Clans = require("../models/clans.model");

exports.getClans = async (req, res) => {
  try {
    const clans = await Clans.find();
    res.status(200).json(clans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar clãs" });
  }
}
