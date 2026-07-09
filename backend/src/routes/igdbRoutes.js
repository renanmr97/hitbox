const express = require("express");
const router = express.Router();
const { searchGames, lookupGame } = require("../controllers/igdbController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: IGDB
 *   description: Integracao com a API do IGDB
 */

/**
 * @swagger
 * /igdb/search:
 *   get:
 *     summary: Busca jogos no IGDB por nome
 *     tags: [IGDB]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Termo de busca
 *     responses:
 *       200:
 *         description: Lista de jogos encontrados no IGDB
 *       400:
 *         description: Parâmetro inválido
 */
router.get("/search", authenticate, authorize("ADMIN"), searchGames);

/**
 * @swagger
 * /igdb/lookup:
 *   get:
 *     summary: Busca dados completos de um jogo pelo ID ou URL do IGDB
 *     tags: [IGDB]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: URL do jogo no IGDB
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID numérico do jogo no IGDB
 *     responses:
 *       200:
 *         description: Dados do jogo formatados
 *       404:
 *         description: Jogo não encontrado no IGDB
 */
router.get("/lookup", authenticate, authorize("ADMIN"), lookupGame);

module.exports = router;