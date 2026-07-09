const express = require("express");
const router = express.Router();
const { getMyProfile } = require("../controllers/usersController");
const authenticate = require("../middlewares/authenticate");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Perfil de usuários
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Retorna o perfil do usuário logado com suas listas e avaliações
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil retornado com sucesso
 *       401:
 *         description: Não autenticado
 */
router.get("/me", authenticate, getMyProfile);

module.exports = router;