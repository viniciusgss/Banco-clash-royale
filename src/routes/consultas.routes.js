const express = require("express");
const {
  consulta1,
  consulta2,
  consulta3,
  consulta4,
  consulta5,
  consulta6,
  consulta7,
  consulta8,
} = require("../controllers/consultas.controller.js");

/**
 * Router instance for handling API routes.
 * This router is used to define and manage the endpoints
 * for the application.
 */
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Consultas
 *   description: Operações relacionadas a Consultas de dados da API
 */

/**
 * @swagger
 * /api/Consultas/1:
 *   get:
 *     summary: Retorna a primeira consulta
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/1", consulta1);

/**
 * @swagger
 * /api/Consultas/2:
 *   get:
 *     summary: Retorna a segunda consulta
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/2", consulta2);

/**
 * @swagger
 * /api/Consultas/3:
 *   get:
 *     summary: Retorna a terceira consulta
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/3", consulta3);

/**
 * @swagger
 * /api/Consultas/4:
 *   get:
 *     summary: Retorna a quarta consulta
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/4", consulta4);

/**
 * @swagger
 * /api/Consultas/5:
 *   get:
 *     summary: Retorna a quinta consulta
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/5", consulta5);

/**
 * @swagger
 * /api/Consultas/6:
 *   get:
 *     summary: Retorna a sexta consulta
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/6", consulta6);

/**
 * @swagger
 * /api/Consultas/7:
 *   get:
 *     summary: Retorna a sétima consulta
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/7", consulta7);

/**
 * @swagger
 * /api/Consultas/8:
 *   get:
 *     summary: Retorna a oitava consulta
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/8", consulta8);

module.exports = router;
