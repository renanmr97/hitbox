const prisma = require("../lib/prisma");

// GET /users/me — retorna o perfil do usuário logado com suas listas
async function getMyProfile(req, res) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        listItems: {
          include: {
            game: {
              include: { covers: true },
            },
          },
          orderBy: { updatedAt: "desc" },
        },
        reviews: {
          include: { game: true },
          orderBy: { updatedAt: "desc" },
        },
        _count: {
          select: {
            listItems: true,
            reviews: true,
            following: true,
            followers: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ error: "Erro ao buscar perfil." });
  }
}

module.exports = { getMyProfile };