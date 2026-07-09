const igdb = require("../lib/igdb");

// GET /igdb/search?q=crash bandicoot — busca jogos por nome
async function searchGames(req, res) {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: "O parâmetro 'q' deve ter no mínimo 2 caracteres.",
      });
    }

    const games = await igdb.searchGames(q.trim());
    const formatted = games.map(igdb.formatGameData);

    res.json(formatted);
  } catch (error) {
    console.error("Erro ao buscar no IGDB:", error.message);
    res.status(500).json({ error: "Erro ao buscar no IGDB." });
  }
}

// GET /igdb/lookup?url=https://igdb.com/games/... ou ?id=1234
// Busca dados completos de um jogo específico para pré-preencher o formulário
async function lookupGame(req, res) {
  try {
    const { url, id } = req.query;

    if (!url && !id) {
      return res.status(400).json({
        error: "Informe 'url' ou 'id' do IGDB.",
      });
    }

    let game = null;

    if (id) {
      const igdbId = parseInt(id);
      if (isNaN(igdbId)) {
        return res.status(400).json({ error: "ID inválido." });
      }
      game = await igdb.getGameById(igdbId);
    } else {
      const slug = igdb.extractSlugFromUrl(url);
      if (!slug) {
        return res.status(400).json({
          error: "URL do IGDB inválida. Use o formato: https://www.igdb.com/games/nome-do-jogo",
        });
      }
      game = await igdb.getGameBySlug(slug);
    }

    if (!game) {
      return res.status(404).json({ error: "Jogo não encontrado no IGDB." });
    }

    res.json(igdb.formatGameData(game));
  } catch (error) {
    console.error("Erro ao buscar jogo no IGDB:", error.message);
    res.status(500).json({ error: "Erro ao buscar jogo no IGDB." });
  }
}

module.exports = { searchGames, lookupGame };