const express = require("express");
const router = express.Router();
const {
  getMyList,
  upsertListItem,
  removeListItem,
  getListItemByGame,
} = require("../controllers/listController");
const authenticate = require("../middlewares/authenticate");

/**
 * @swagger
 * tags:
 *   name: List
 *   description: Lista pessoal de jogos do usuário
 */

/**
 * @swagger
 * /list:
 *   get:
 *     summary: Retorna a lista de jogos do usuário logado
 *     tags: [List]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *       401:
 *         description: Não autenticado
 */
router.get("/", authenticate, getMyList);

/**
 * @swagger
 * /list:
 *   post:
 *     summary: Adiciona ou atualiza um jogo na lista
 *     tags: [List]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *               - status
 *             properties:
 *               gameId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [WANT_TO_PLAY, PLAYING, PLAYED]
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Item salvo na lista
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.post("/", authenticate, upsertListItem);

/**
 * @swagger
 * /list/{gameId}:
 *   get:
 *     summary: Verifica se um jogo está na lista do usuário
 *     tags: [List]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item encontrado
 *       404:
 *         description: Jogo não está na lista
 */
router.get("/:gameId", authenticate, getListItemByGame);

/**
 * @swagger
 * /list/{gameId}:
 *   delete:
 *     summary: Remove um jogo da lista
 *     tags: [List]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Item removido
 *       404:
 *         description: Item não encontrado
 */
router.delete("/:gameId", authenticate, removeListItem);

module.exports = router;