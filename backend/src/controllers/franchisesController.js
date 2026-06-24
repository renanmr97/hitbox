const prisma = require("../lib/prisma");

// GET /franchises — lista todas as franquias
async function listFranchises(req, res) {
  try {
    const franchises = await prisma.franchise.findMany({
      orderBy: { name: "asc" },
    });

    res.json(franchises);
  } catch (error) {
    console.error("Erro ao listar franquias:", error);
    res.status(500).json({ error: "Erro ao buscar franquias." });
  }
}

// GET /franchises/:id — detalhe de uma franquia, com os jogos relacionados
async function getFranchiseById(req, res) {
  try {
    const { id } = req.params;

    const franchise = await prisma.franchise.findUnique({
      where: { id },
      include: {
        gameFranchises: { include: { game: true } },
      },
    });

    if (!franchise) {
      return res.status(404).json({ error: "Franquia não encontrada." });
    }

    res.json(franchise);
  } catch (error) {
    console.error("Erro ao buscar franquia:", error);
    res.status(500).json({ error: "Erro ao buscar franquia." });
  }
}

// POST /franchises — cria uma nova franquia
async function createFranchise(req, res) {
  try {
    const { name, logoUrl } = req.body;

    if (!name) {
      return res.status(400).json({ error: "O campo 'name' é obrigatório." });
    }

    const franchise = await prisma.franchise.create({
      data: { name, logoUrl },
    });

    res.status(201).json(franchise);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe uma franquia com esse nome." });
    }
    console.error("Erro ao criar franquia:", error);
    res.status(500).json({ error: "Erro ao criar franquia." });
  }
}

// PUT /franchises/:id — atualiza uma franquia existente
async function updateFranchise(req, res) {
  try {
    const { id } = req.params;
    const { name, logoUrl } = req.body;

    const existingFranchise = await prisma.franchise.findUnique({ where: { id } });

    if (!existingFranchise) {
      return res.status(404).json({ error: "Franquia não encontrada." });
    }

    const franchise = await prisma.franchise.update({
      where: { id },
      data: { name, logoUrl },
    });

    res.json(franchise);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe uma franquia com esse nome." });
    }
    console.error("Erro ao atualizar franquia:", error);
    res.status(500).json({ error: "Erro ao atualizar franquia." });
  }
}

// DELETE /franchises/:id — remove uma franquia
async function deleteFranchise(req, res) {
  try {
    const { id } = req.params;

    const existingFranchise = await prisma.franchise.findUnique({ where: { id } });

    if (!existingFranchise) {
      return res.status(404).json({ error: "Franquia não encontrada." });
    }

    await prisma.franchise.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar franquia:", error);
    res.status(500).json({ error: "Erro ao deletar franquia." });
  }
}

module.exports = {
  listFranchises,
  getFranchiseById,
  createFranchise,
  updateFranchise,
  deleteFranchise,
};