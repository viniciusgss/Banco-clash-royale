const express = require("express");
const {
  registrar,
  login,
  createAccessToken,
  deleteRefreshToken,
} = require("../controllers/auth.controller");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Gerenciamento de autenticação do sistema.
 */

/**
 * @swagger
 * /api/auth/registrar:
 *   post:
 *     summary: Registra um novo usuário no sistema.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome completo do usuário.
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Endereço de e-mail válido do usuário.
 *                 example: joao.silva@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 description: Senha de acesso (mínimo de 6 caracteres).
 *                 example: senha123
 *               foto:
 *                 type: string
 *                 format: url
 *                 description: Url da foto de perfil do usuário.
 *                 example: https://exemplo.com/foto.jpg
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário registrado com sucesso.
 *       400:
 *         description: Dados inválidos na requisição.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Campos obrigatórios não preenchidos.
 *       401:
 *         description: Não autorizado. Token de autenticação ausente ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Token de autenticação inválido.
 */
router.post("/registrar", registrar);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail registrado do usuário.
 *                 example: joao.silva@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 description: Senha correspondente ao e-mail.
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação futura.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciais inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usuário ou senha incorretos.
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/AccessToken:
 *   post:
 *     summary: Gera um novo token de acesso usando o refresh token.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de atualização válido.
 *                 example: "dGhpc2lzYXJlZnJlc2h0b2tlbg=="
 *     responses:
 *       200:
 *         description: Novo token de acesso gerado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Novo token JWT de acesso.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Token de atualização inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Token de atualização inválido.
 */
router.post("/AccessToken", createAccessToken);

/**
 * @swagger
 * /api/auth/logout:
 *   delete:
 *     summary: Remove o refresh token, invalidando futuras requisições de atualização.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de atualização que será revogado.
 *                 example: "dGhpc2lzYXJlZnJlc2h0b2tlbg=="
 *     responses:
 *       200:
 *         description: Refresh token removido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token removido com sucesso.
 *       401:
 *         description: Token inválido ou não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Refresh token não encontrado ou já removido.
 */
router.delete("/logout", deleteRefreshToken);

module.exports = router;
