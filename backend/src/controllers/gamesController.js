const prisma = require("../lib/prisma");

async function listGames(req, res) {
  try {
    const { search } = req.query;

    const games = await prisma.game.findMany({
      where: search
        ? { title: { contains: search, mode: "insensitive" } }
        : undefined,
      include: { covers: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(games);
  } catch (error) {
    console.error("Erro ao listar jogos:", error);
    res.status(500).json({ error: "Erro ao buscar jogos." });
  }
}

async function getGameById(req, res) {
  try {
    const { id } = req.params;

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        covers: true,
        localizedTitles: true,
        gamePlatforms: {
          include: {
            platform: true,
            releases: true,
          },
        },
        gameFranchises: { include: { franchise: true } },
        gameGenres: { include: { genre: true } },
        reviews: {
          include: { user: { select: { id: true, username: true } } },
        },
      },
    });

    if (!game) return res.status(404).json({ error: "Jogo não encontrado." });

    res.json(game);
  } catch (error) {
    console.error("Erro ao buscar jogo:", error);
    res.status(500).json({ error: "Erro ao buscar jogo." });
  }
}

async function createGame(req, res) {
  try {
    const {
      title,
      synopsis,
      initialReleaseDate,
      igdbUrl,
      igdbId,
      covers,
      platforms,
      genres,
      franchises,
      localizedTitles,
      releaseDates,
    } = req.body;

    if (!title) return res.status(400).json({ error: "O campo 'title' é obrigatório." });

    const game = await prisma.$transaction(async (tx) => {
      // Cria o jogo base
      const newGame = await tx.game.create({
        data: {
          title,
          synopsis,
          initialReleaseDate: initialReleaseDate ? new Date(initialReleaseDate) : null,
          igdbUrl,
          igdbId: igdbId ? parseInt(igdbId) : null,
        },
      });

      // Covers
      if (covers?.length > 0) {
        await tx.cover.createMany({
          data: covers.map((c, i) => ({
            gameId: newGame.id,
            imageUrl: c.imageUrl,
            region: c.region || null,
            isPrimary: i === 0,
          })),
        });
      }

      // Títulos localizados
      if (localizedTitles?.length > 0) {
        await tx.localizedTitle.createMany({
          data: localizedTitles.map((lt) => ({
            gameId: newGame.id,
            title: lt.title,
            locale: lt.locale,
          })),
        });
      }

      // Gêneros — cria se não existir (upsert por igdbId ou nome)
      if (genres?.length > 0) {
        for (const g of genres) {
          const genre = await tx.genre.upsert({
            where: g.igdbId ? { igdbId: g.igdbId } : { name: g.name },
            update: {},
            create: { name: g.name, igdbId: g.igdbId || null },
          });
          await tx.gameGenre.create({
            data: { gameId: newGame.id, genreId: genre.id },
          });
        }
      }

      // Franquias
      if (franchises?.length > 0) {
        for (const f of franchises) {
          const franchise = await tx.franchise.upsert({
            where: { name: f.name },
            update: {},
            create: { name: f.name },
          });
          await tx.gameFranchise.create({
            data: { gameId: newGame.id, franchiseId: franchise.id },
          });
        }
      }

      // Plataformas e datas de lançamento
      if (platforms?.length > 0) {
        for (const p of platforms) {
          const platform = await tx.platform.upsert({
            where: p.igdbId ? { igdbId: p.igdbId } : { name: p.name },
            update: {},
            create: { name: p.name, igdbId: p.igdbId || null },
          });

          const gamePlatform = await tx.gamePlatform.create({
            data: { gameId: newGame.id, platformId: platform.id },
          });

          // Datas de lançamento associadas a essa plataforma
          const platformReleases = (releaseDates || []).filter(
            (rd) => rd.igdbPlatformId === p.igdbId
          );
          if (platformReleases.length > 0) {
            await tx.release.createMany({
              data: platformReleases.map((rd) => ({
                gamePlatformId: gamePlatform.id,
                region: rd.region,
                releaseDate: new Date(rd.releaseDate),
              })),
            });
          }
        }
      }

      return newGame;
    });

    const fullGame = await prisma.game.findUnique({
      where: { id: game.id },
      include: {
        covers: true,
        gamePlatforms: { include: { platform: true, releases: true } },
        gameFranchises: { include: { franchise: true } },
        gameGenres: { include: { genre: true } },
      },
    });

    res.status(201).json(fullGame);
  } catch (error) {
    console.error("Erro ao criar jogo:", error);
    res.status(500).json({ error: "Erro ao criar jogo." });
  }
}

async function updateGame(req, res) {
  try {
    const { id } = req.params;
    const { title, synopsis, initialReleaseDate, igdbUrl } = req.body;

    const existingGame = await prisma.game.findUnique({ where: { id } });
    if (!existingGame) return res.status(404).json({ error: "Jogo não encontrado." });

    const game = await prisma.game.update({
      where: { id },
      data: {
        title,
        synopsis,
        initialReleaseDate: initialReleaseDate ? new Date(initialReleaseDate) : undefined,
        igdbUrl,
      },
    });

    res.json(game);
  } catch (error) {
    console.error("Erro ao atualizar jogo:", error);
    res.status(500).json({ error: "Erro ao atualizar jogo." });
  }
}

async function deleteGame(req, res) {
  try {
    const { id } = req.params;
    const existingGame = await prisma.game.findUnique({ where: { id } });
    if (!existingGame) return res.status(404).json({ error: "Jogo não encontrado." });

    await prisma.game.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar jogo:", error);
    res.status(500).json({ error: "Erro ao deletar jogo." });
  }
}

module.exports = { listGames, getGameById, createGame, updateGame, deleteGame };