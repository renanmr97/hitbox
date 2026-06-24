const express = require("express");
const router = express.Router();
const {
  listGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} = require("../controllers/gamesController");

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Gerenciamento do catálogo de jogos
 */

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Lista todos os jogos
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: Lista de jogos retornada com sucesso
 */
router.get("/", listGames);

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Busca um jogo pelo ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do jogo
 *     responses:
 *       200:
 *         description: Jogo encontrado
 *       404:
 *         description: Jogo não encontrado
 */
router.get("/:id", getGameById);

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Cria um novo jogo
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Crash Bandicoot Warped
 *               synopsis:
 *                 type: string
 *                 example: Crash precisa impedir o Dr. Neo Cortex.
 *               initialReleaseDate:
 *                 type: string
 *                 format: date
 *                 example: "1998-10-31"
 *               igdbUrl:
 *                 type: string
 *                 example: "https://igdb.com/games/crash-bandicoot-warped"
 *               wikipediaUrl:
 *                 type: string
 *                 example: "https://en.wikipedia.org/wiki/Crash_Bandicoot_3"
 *     responses:
 *       201:
 *         description: Jogo criado com sucesso
 *       400:
 *         description: Campo obrigatório ausente
 */
router.post("/", createGame);

/**
 * @swagger
 * /games/{id}:
 *   put:
 *     summary: Atualiza um jogo existente
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do jogo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               synopsis:
 *                 type: string
 *               initialReleaseDate:
 *                 type: string
 *                 format: date
 *               igdbUrl:
 *                 type: string
 *               wikipediaUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Jogo atualizado com sucesso
 *       404:
 *         description: Jogo não encontrado
 */
router.put("/:id", updateGame);

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     summary: Remove um jogo
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do jogo
 *     responses:
 *       204:
 *         description: Jogo removido com sucesso
 *       404:
 *         description: Jogo não encontrado
 */
router.delete("/:id", deleteGame);

module.exports = router;