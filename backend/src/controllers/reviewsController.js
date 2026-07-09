const prisma = require("../lib/prisma");

// GET /reviews/game/:gameId — lista avaliações de um jogo
async function getGameReviews(req, res) {
  try {
    const { gameId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { gameId },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    res.status(500).json({ error: "Erro ao buscar avaliações." });
  }
}

// POST /reviews — cria ou atualiza avaliação do usuário logado
async function upsertReview(req, res) {
  try {
    const userId = req.user.id;
    const { gameId, rating, comment } = req.body;

    if (!gameId || rating === undefined) {
      return res.status(400).json({
        error: "Os campos 'gameId' e 'rating' são obrigatórios.",
      });
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 10) {
      return res.status(400).json({
        error: "A nota deve ser um número inteiro entre 1 e 10.",
      });
    }

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      return res.status(404).json({ error: "Jogo não encontrado." });
    }

    const review = await prisma.review.upsert({
      where: { userId_gameId: { userId, gameId } },
      update: { rating: ratingNum, comment },
      create: { userId, gameId, rating: ratingNum, comment },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    res.status(200).json(review);
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    res.status(500).json({ error: "Erro ao salvar avaliação." });
  }
}

// DELETE /reviews/:gameId — remove avaliação do usuário logado
async function deleteReview(req, res) {
  try {
    const userId = req.user.id;
    const { gameId } = req.params;

    const existing = await prisma.review.findUnique({
      where: { userId_gameId: { userId, gameId } },
    });

    if (!existing) {
      return res.status(404).json({ error: "Avaliação não encontrada." });
    }

    await prisma.review.delete({
      where: { userId_gameId: { userId, gameId } },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar avaliação:", error);
    res.status(500).json({ error: "Erro ao deletar avaliação." });
  }
}

module.exports = { getGameReviews, upsertReview, deleteReview };