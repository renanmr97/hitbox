const express = require("express");
const router = express.Router();
const {
  searchGames,
  lookupGame,
  searchPlatforms,
  lookupPlatform,
} = require("../controllers/igdbController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: IGDB
 *   description: Integração com a API do IGDB
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
 *     responses:
 *       200:
 *         description: Lista de jogos
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
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *       - in: query
 *         name: translate
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Se "true", traduz a sinopse para pt-BR via DeepL
 *     responses:
 *       200:
 *         description: Dados do jogo formatados
 *       404:
 *         description: Jogo não encontrado
 */
router.get("/lookup", authenticate, authorize("ADMIN"), lookupGame);

/**
 * @swagger
 * /igdb/platforms/search:
 *   get:
 *     summary: Busca plataformas no IGDB por nome
 *     tags: [IGDB]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de plataformas
 */
router.get("/platforms/search", authenticate, authorize("ADMIN"), searchPlatforms);

/**
 * @swagger
 * /igdb/platforms/lookup:
 *   get:
 *     summary: Busca dados de uma plataforma pelo ID ou URL do IGDB
 *     tags: [IGDB]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados da plataforma formatados
 *       404:
 *         description: Plataforma não encontrada
 */
router.get("/platforms/lookup", authenticate, authorize("ADMIN"), lookupPlatform);

module.exports = router;