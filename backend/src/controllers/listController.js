const prisma = require("../lib/prisma");

// GET /list — retorna todos os itens da lista do usuário logado
async function getMyList(req, res) {
  try {
    const userId = req.user.id;

    const items = await prisma.listItem.findMany({
      where: { userId },
      include: { game: { include: { covers: true } } },
      orderBy: { updatedAt: "desc" },
    });

    res.json(items);
  } catch (error) {
    console.error("Erro ao buscar lista:", error);
    res.status(500).json({ error: "Erro ao buscar lista." });
  }
}

// POST /list — adiciona ou atualiza um jogo na lista
async function upsertListItem(req, res) {
  try {
    const userId = req.user.id;
    const { gameId, status, isPublic } = req.body;

    if (!gameId || !status) {
      return res.status(400).json({
        error: "Os campos 'gameId' e 'status' são obrigatórios.",
      });
    }

    const validStatuses = ["WANT_TO_PLAY", "PLAYING", "PLAYED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Status inválido. Use: ${validStatuses.join(", ")}`,
      });
    }

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      return res.status(404).json({ error: "Jogo não encontrado." });
    }

    // upsert = atualiza se já existe, cria se não existe
    const item = await prisma.listItem.upsert({
      where: { userId_gameId: { userId, gameId } },
      update: { status, isPublic: isPublic ?? true },
      create: { userId, gameId, status, isPublic: isPublic ?? true },
    });

    res.status(200).json(item);
  } catch (error) {
    console.error("Erro ao salvar item na lista:", error);
    res.status(500).json({ error: "Erro ao salvar item na lista." });
  }
}

// DELETE /list/:gameId — remove um jogo da lista
async function removeListItem(req, res) {
  try {
    const userId = req.user.id;
    const { gameId } = req.params;

    const existing = await prisma.listItem.findUnique({
      where: { userId_gameId: { userId, gameId } },
    });

    if (!existing) {
      return res.status(404).json({ error: "Item não encontrado na lista." });
    }

    await prisma.listItem.delete({
      where: { userId_gameId: { userId, gameId } },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao remover item da lista:", error);
    res.status(500).json({ error: "Erro ao remover item da lista." });
  }
}

// GET /list/:gameId — verifica se um jogo específico está na lista do usuário
async function getListItemByGame(req, res) {
  try {
    const userId = req.user.id;
    const { gameId } = req.params;

    const item = await prisma.listItem.findUnique({
      where: { userId_gameId: { userId, gameId } },
    });

    if (!item) {
      return res.status(404).json({ error: "Jogo não está na lista." });
    }

    res.json(item);
  } catch (error) {
    console.error("Erro ao buscar item:", error);
    res.status(500).json({ error: "Erro ao buscar item da lista." });
  }
}

module.exports = { getMyList, upsertListItem, removeListItem, getListItemByGame };