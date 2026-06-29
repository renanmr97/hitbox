const express = require("express");
const router = express.Router();
const {
  listPlatforms,
  getPlatformById,
  createPlatform,
  updatePlatform,
  deletePlatform,
} = require("../controllers/platformsController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: Platforms
 *   description: Gerenciamento de plataformas/consoles
 */

/**
 * @swagger
 * /platforms:
 *   get:
 *     summary: Lista todas as plataformas
 *     tags: [Platforms]
 *     responses:
 *       200:
 *         description: Lista de plataformas retornada com sucesso
 */
router.get("/", listPlatforms);

/**
 * @swagger
 * /platforms/{id}:
 *   get:
 *     summary: Busca uma plataforma pelo ID
 *     tags: [Platforms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plataforma encontrada
 *       404:
 *         description: Plataforma não encontrada
 */
router.get("/:id", getPlatformById);

/**
 * @swagger
 * /platforms:
 *   post:
 *     summary: Cria uma nova plataforma
 *     tags: [Platforms]
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
 *                 example: PlayStation 1
 *               logoUrl:
 *                 type: string
 *                 example: "https://exemplo.com/ps1-logo.png"
 *     responses:
 *       201:
 *         description: Plataforma criada com sucesso
 *       400:
 *         description: Campo obrigatório ausente
 *       409:
 *         description: Já existe uma plataforma com esse nome
 */
router.post("/", createPlatform);

/**
 * @swagger
 * /platforms/{id}:
 *   put:
 *     summary: Atualiza uma plataforma existente
 *     tags: [Platforms]
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
 *               logoUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plataforma atualizada com sucesso
 *       404:
 *         description: Plataforma não encontrada
 *       409:
 *         description: Já existe uma plataforma com esse nome
 */
router.put("/:id", updatePlatform);

/**
 * @swagger
 * /platforms/{id}:
 *   delete:
 *     summary: Remove uma plataforma
 *     tags: [Platforms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Plataforma removida com sucesso
 *       404:
 *         description: Plataforma não encontrada
 */
router.delete("/:id", deletePlatform);

module.exports = router;