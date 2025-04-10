const jwt = require("jsonwebtoken");
const { createUsuario, compareSenha } = require("../models/usuarios.models");
const config = require("../config/jwt");

exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha, avatar } = req.body;
    const usuario = await createUsuario({
      nome,
      email,
      senha,
      avatar,
    });
    if (!usuario) {
      return res.status(400).json({ message: "Erro ao registrar usuário." });
    }
    res.status(201).json({ message: "Usuario registrado com sucesso." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { nome, senha } = req.body;
    const usuario = await Usuario.findOne({
      $or: [{ email: nome }, { nome: nome }],
    });
    if (!usuario || !(await usuario.compareSenha(senha))) {
      return res.status(401).json({ message: "Dados inválidos." });
    }
    const token = jwt.sign({ id: usuario._id }, config.secret, {
      expiresIn: "12h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
