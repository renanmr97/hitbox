const prisma = require("../lib/prisma");

// GET /games — lista todos os jogos
async function listGames(req, res) {
  try {
    const games = await prisma.game.findMany({
      include: {
        covers: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(games);
  } catch (error) {
    console.error("Erro ao listar jogos:", error);
    res.status(500).json({ error: "Erro ao buscar jogos." });
  }
}

// GET /games/:id — detalhe de um jogo específico
async function getGameById(req, res) {
  try {
    const { id } = req.params;

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        covers: true,
        localizedTitles: true,
        gamePlatforms: { include: { platform: true } },
        gameFranchises: { include: { franchise: true } },
        reviews: true,
      },
    });

    if (!game) {
      return res.status(404).json({ error: "Jogo não encontrado." });
    }

    res.json(game);
  } catch (error) {
    console.error("Erro ao buscar jogo:", error);
    res.status(500).json({ error: "Erro ao buscar jogo." });
  }
}

// POST /games — cria um novo jogo
async function createGame(req, res) {
  try {
    const { title, synopsis, initialReleaseDate, igdbUrl, wikipediaUrl } = req.body;

    if (!title) {
      return res.status(400).json({ error: "O campo 'title' é obrigatório." });
    }

    const game = await prisma.game.create({
      data: {
        title,
        synopsis,
        initialReleaseDate: initialReleaseDate ? new Date(initialReleaseDate) : null,
        igdbUrl,
        wikipediaUrl,
      },
    });

    res.status(201).json(game);
  } catch (error) {
    console.error("Erro ao criar jogo:", error);
    res.status(500).json({ error: "Erro ao criar jogo." });
  }
}

// PUT /games/:id — atualiza um jogo existente
async function updateGame(req, res) {

  try {
    const { id } = req.params;
    const { title, synopsis, initialReleaseDate, igdbUrl, wikipediaUrl } = req.body;

    const existingGame = await prisma.game.findUnique({ where: { id } });
  
    if (!existingGame) {
      return res.status(404).json({ error: "Jogo não encontrado." });
    }

    const game = await prisma.game.update({
      where: { id },
      data: {
        title,
        synopsis,
        initialReleaseDate: initialReleaseDate ? new Date(initialReleaseDate) : undefined,
        igdbUrl,
        wikipediaUrl,
      },
    });

    res.json(game);
  } catch (error) {
    console.error("Erro ao atualizar jogo:", error);
    res.status(500).json({ error: "Erro ao atualizar jogo." });
  }
}

// DELETE /games/:id — exclui um jogo existente
async function deleteGame(req, res) {
  try {
    const { id } = req.params;

    const existingGame = await prisma.game.findUnique({ where: { id } });

    if (!existingGame) {
      return res.status(404).json({ error: "Jogo não encontrado." });
    }

    await prisma.game.delete({ where: { id } });
    
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir jogo:", error);
    res.status(500).json({ error: "Erro ao excluir jogo." });
  }
}

module.exports = {
  listGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
};