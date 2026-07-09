const prisma = require("../lib/prisma");

async function listGenres(req, res) {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: { name: "asc" },
    });
    res.json(genres);
  } catch (error) {
    console.error("Erro ao listar gêneros:", error);
    res.status(500).json({ error: "Erro ao buscar gêneros." });
  }
}

async function createGenre(req, res) {
  try {
    const { name, igdbId } = req.body;
    if (!name) return res.status(400).json({ error: "Nome é obrigatório." });

    const genre = await prisma.genre.create({
      data: { name, igdbId: igdbId ? parseInt(igdbId) : null },
    });
    res.status(201).json(genre);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe um gênero com esse nome." });
    }
    console.error("Erro ao criar gênero:", error);
    res.status(500).json({ error: "Erro ao criar gênero." });
  }
}

async function updateGenre(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existing = await prisma.genre.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Gênero não encontrado." });

    const genre = await prisma.genre.update({
      where: { id },
      data: { name },
    });
    res.json(genre);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe um gênero com esse nome." });
    }
    console.error("Erro ao atualizar gênero:", error);
    res.status(500).json({ error: "Erro ao atualizar gênero." });
  }
}

async function deleteGenre(req, res) {
  try {
    const { id } = req.params;
    const existing = await prisma.genre.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Gênero não encontrado." });

    await prisma.genre.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar gênero:", error);
    res.status(500).json({ error: "Erro ao deletar gênero." });
  }
}

module.exports = { listGenres, createGenre, updateGenre, deleteGenre };