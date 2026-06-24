const prisma = require("../lib/prisma");

// GET /platforms — lista todas as plataformas
async function listPlatforms(req, res) {
  try {
    const platforms = await prisma.platform.findMany({
      orderBy: { name: "asc" },
    });

    res.json(platforms);
  } catch (error) {
    console.error("Erro ao listar plataformas:", error);
    res.status(500).json({ error: "Erro ao buscar plataformas." });
  }
}

// GET /platforms/:id — detalhe de uma plataforma, com os jogos relacionados
async function getPlatformById(req, res) {
  try {
    const { id } = req.params;

    const platform = await prisma.platform.findUnique({
      where: { id },
      include: {
        gamePlatforms: { include: { game: true } },
      },
    });

    if (!platform) {
      return res.status(404).json({ error: "Plataforma não encontrada." });
    }

    res.json(platform);
  } catch (error) {
    console.error("Erro ao buscar plataforma:", error);
    res.status(500).json({ error: "Erro ao buscar plataforma." });
  }
}

// POST /platforms — cria uma nova plataforma
async function createPlatform(req, res) {
  try {
    const { name, logoUrl } = req.body;

    if (!name) {
      return res.status(400).json({ error: "O campo 'name' é obrigatório." });
    }

    const platform = await prisma.platform.create({
      data: { name, logoUrl },
    });

    res.status(201).json(platform);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe uma plataforma com esse nome." });
    }
    console.error("Erro ao criar plataforma:", error);
    res.status(500).json({ error: "Erro ao criar plataforma." });
  }
}

// PUT /platforms/:id — atualiza uma plataforma existente
async function updatePlatform(req, res) {
  try {
    const { id } = req.params;
    const { name, logoUrl } = req.body;

    const existingPlatform = await prisma.platform.findUnique({ where: { id } });

    if (!existingPlatform) {
      return res.status(404).json({ error: "Plataforma não encontrada." });
    }

    const platform = await prisma.platform.update({
      where: { id },
      data: { name, logoUrl },
    });

    res.json(platform);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe uma plataforma com esse nome." });
    }
    console.error("Erro ao atualizar plataforma:", error);
    res.status(500).json({ error: "Erro ao atualizar plataforma." });
  }
}

// DELETE /platforms/:id — remove uma plataforma
async function deletePlatform(req, res) {
  try {
    const { id } = req.params;

    const existingPlatform = await prisma.platform.findUnique({ where: { id } });

    if (!existingPlatform) {
      return res.status(404).json({ error: "Plataforma não encontrada." });
    }

    await prisma.platform.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar plataforma:", error);
    res.status(500).json({ error: "Erro ao deletar plataforma." });
  }
}

module.exports = {
  listPlatforms,
  getPlatformById,
  createPlatform,
  updatePlatform,
  deletePlatform,
};