const express = require("express");
const router = express.Router();
const {
  listFranchises,
  getFranchiseById,
  createFranchise,
  updateFranchise,
  deleteFranchise,
} = require("../controllers/franchisesController");

/**
 * @swagger
 * tags:
 *   name: Franchises
 *   description: Gerenciamento de franquias de jogos
 */

/**
 * @swagger
 * /franchises:
 *   get:
 *     summary: Lista todas as franquias
 *     tags: [Franchises]
 *     responses:
 *       200:
 *         description: Lista de franquias retornada com sucesso
 */
router.get("/", listFranchises);

/**
 * @swagger
 * /franchises/{id}:
 *   get:
 *     summary: Busca uma franquia pelo ID
 *     tags: [Franchises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Franquia encontrada
 *       404:
 *         description: Franquia não encontrada
 */
router.get("/:id", getFranchiseById);

/**
 * @swagger
 * /franchises:
 *   post:
 *     summary: Cria uma nova franquia
 *     tags: [Franchises]
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
 *                 example: Crash Bandicoot
 *               logoUrl:
 *                 type: string
 *                 example: "https://exemplo.com/crash-logo.png"
 *     responses:
 *       201:
 *         description: Franquia criada com sucesso
 *       400:
 *         description: Campo obrigatório ausente
 *       409:
 *         description: Já existe uma franquia com esse nome
 */
router.post("/", createFranchise);

/**
 * @swagger
 * /franchises/{id}:
 *   put:
 *     summary: Atualiza uma franquia existente
 *     tags: [Franchises]
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
 *         description: Franquia atualizada com sucesso
 *       404:
 *         description: Franquia não encontrada
 *       409:
 *         description: Já existe uma franquia com esse nome
 */
router.put("/:id", updateFranchise);

/**
 * @swagger
 * /franchises/{id}:
 *   delete:
 *     summary: Remove uma franquia
 *     tags: [Franchises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Franquia removida com sucesso
 *       404:
 *         description: Franquia não encontrada
 */
router.delete("/:id", deleteFranchise);

module.exports = router;