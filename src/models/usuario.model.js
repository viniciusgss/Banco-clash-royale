const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/database.js");
const db = connectDB();

async function createUsuario(usuario) {
  const collection = await db.collection("usuarios");
  if (usuario.senha) {
    usuario.senha = await bcrypt.hash(usuario.senha, 10);
  }
  usuario.createdAt = new Date();
  usuario.updatedAt = new Date();
  return collection.insertOne(usuario);
}

async function getUsuarioById(id) {
  const collection = await db.collection("usuarios");
  return collection.findOne({ _id: ObjectId.createFromHexString(id) });
}

async function updateUsuario(id, updates) {
  const collection = await db.collection("usuarios");
  if (updates.senha) {
    updates.senha = await bcrypt.hash(updates.senha, 10);
  }
  updates.updatedAt = new Date();
  return collection.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    { $set: updates }
  );
}

async function deleteUsuario(id) {
  const collection = await db.collection("usuarios");
  return collection.deleteOne({ _id: ObjectId.createFromHexString(id) });
}

async function compareSenha(email, senha) {
  const collection = await db.collection("usuarios");
  const usuario = await collection.findOne({ email });
  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }
  return bcrypt.compare(senha, usuario.senha);
}

module.exports = {
  createUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  compareSenha,
};
