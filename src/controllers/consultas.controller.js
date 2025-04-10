exports.consulta1 = async (req, res) => {
  try {
    const { id } = req.params;
    const { query } = req;
    const collection = await db.collection("battles");
    const consulta = await collection.agregate([{ $match: {} }]);
    if (!consulta) {
      return res.status(404).json({ message: "Consulta não encontrada" });
    }
    res.status(200).json(consulta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar consulta" });
  }
};
