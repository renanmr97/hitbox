const igdb = require("../lib/igdb");
const { translateToPtBr } = require("../lib/deepl");

// GET /igdb/search?q=crash — busca jogos
async function searchGames(req, res) {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: "Mínimo 2 caracteres." });
    }
    const games = await igdb.searchGames(q.trim());
    res.json(games.map(igdb.formatGameData));
  } catch (error) {
    console.error("Erro ao buscar jogos no IGDB:", error.message);
    res.status(500).json({ error: "Erro ao buscar no IGDB." });
  }
}

// GET /igdb/lookup?url=...&translate=true — busca jogo completo
async function lookupGame(req, res) {
  try {
    const { url, id, translate } = req.query;

    if (!url && !id) {
      return res.status(400).json({ error: "Informe 'url' ou 'id'." });
    }

    let game = null;

    if (id) {
      const igdbId = parseInt(id);
      if (isNaN(igdbId)) return res.status(400).json({ error: "ID inválido." });
      game = await igdb.getGameById(igdbId);
    } else {
      const slug = igdb.extractSlugFromUrl(url);
      if (!slug) return res.status(400).json({ error: "URL inválida." });
      game = await igdb.getGameBySlug(slug);
    }

    if (!game) {
      return res.status(404).json({ error: "Jogo não encontrado no IGDB." });
    }

    const formatted = igdb.formatGameData(game);

    // Traduz a sinopse se solicitado
    if (translate === "true" && formatted.synopsis) {
      formatted.synopsisTranslated = await translateToPtBr(formatted.synopsis);
    }

    res.json(formatted);
  } catch (error) {
    console.error("Erro ao buscar jogo no IGDB:", error.message);
    res.status(500).json({ error: "Erro ao buscar no IGDB." });
  }
}

// GET /igdb/platforms/search?q=playstation — busca plataformas
async function searchPlatforms(req, res) {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: "Mínimo 2 caracteres." });
    }
    const platforms = await igdb.searchPlatforms(q.trim());
    res.json(platforms.map(igdb.formatPlatformData));
  } catch (error) {
    console.error("Erro ao buscar plataformas no IGDB:", error.message);
    res.status(500).json({ error: "Erro ao buscar no IGDB." });
  }
}

// GET /igdb/platforms/lookup?url=...&id=... — busca plataforma completa
async function lookupPlatform(req, res) {
  try {
    const { url, id } = req.query;

    if (!url && !id) {
      return res.status(400).json({ error: "Informe 'url' ou 'id'." });
    }

    let platform = null;

    if (id) {
      const igdbId = parseInt(id);
      if (isNaN(igdbId)) return res.status(400).json({ error: "ID inválido." });
      platform = await igdb.getPlatformById(igdbId);
    } else {
      const slug = igdb.extractPlatformSlugFromUrl(url);
      if (!slug) return res.status(400).json({ error: "URL inválida. Use o formato: https://www.igdb.com/platforms/nome-da-plataforma" });
      platform = await igdb.getPlatformBySlug(slug);
    }

    if (!platform) {
      return res.status(404).json({ error: "Plataforma não encontrada no IGDB." });
    }

    res.json(igdb.formatPlatformData(platform));
  } catch (error) {
    console.error("Erro ao buscar plataforma no IGDB:", error.message);
    res.status(500).json({ error: "Erro ao buscar no IGDB." });
  }
}

module.exports = { searchGames, lookupGame, searchPlatforms, lookupPlatform };