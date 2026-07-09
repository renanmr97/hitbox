const express = require("express");
const router = express.Router();
const {
  getGameReviews,
  upsertReview,
  deleteReview,
} = require("../controllers/reviewsController");
const authenticate = require("../middlewares/authenticate");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Avaliações de jogos
 */

/**
 * @swagger
 * /reviews/game/{gameId}:
 *   get:
 *     summary: Lista todas as avaliações de um jogo
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de avaliações retornada com sucesso
 */
router.get("/game/:gameId", getGameReviews);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Cria ou atualiza uma avaliação
 *     tags: [Reviews]
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
 *               - rating
 *             properties:
 *               gameId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Avaliação salva com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.post("/", authenticate, upsertReview);

/**
 * @swagger
 * /reviews/{gameId}:
 *   delete:
 *     summary: Remove a avaliação do usuário logado para um jogo
 *     tags: [Reviews]
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
 *         description: Avaliação removida
 *       404:
 *         description: Avaliação não encontrada
 */
router.delete("/:gameId", authenticate, deleteReview);

module.exports = router;