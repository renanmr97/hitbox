const express = require("express");
const router = express.Router();
const {
  listGenres,
  createGenre,
  updateGenre,
  deleteGenre,
} = require("../controllers/genresController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: Gêneros de jogos
 */

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Lista todos os gêneros
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: Lista de gêneros
 */
router.get("/", listGenres);

/**
 * @swagger
 * /genres:
 *   post:
 *     summary: Cria um novo gênero
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Action
 *               igdbId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Gênero criado
 *       409:
 *         description: Gênero já existe
 */
router.post("/", authenticate, authorize("ADMIN"), createGenre);

/**
 * @swagger
 * /genres/{id}:
 *   put:
 *     summary: Atualiza um gênero
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gênero atualizado
 *       404:
 *         description: Gênero não encontrado
 */
router.put("/:id", authenticate, authorize("ADMIN"), updateGenre);

/**
 * @swagger
 * /genres/{id}:
 *   delete:
 *     summary: Remove um gênero
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Gênero removido
 *       404:
 *         description: Gênero não encontrado
 */
router.delete("/:id", authenticate, authorize("ADMIN"), deleteGenre);

module.exports = router;