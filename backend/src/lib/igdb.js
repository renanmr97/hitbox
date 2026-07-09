const axios = require("axios");

let cachedToken = null;
let tokenExpiresAt = null;

// Obtém (ou reutiliza) o access token do Twitch
async function getAccessToken() {
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const res = await axios.post("https://id.twitch.tv/oauth2/token", null, {
    params: {
      client_id: process.env.IGDB_CLIENT_ID,
      client_secret: process.env.IGDB_CLIENT_SECRET,
      grant_type: "client_credentials",
    },
  });

  cachedToken = res.data.access_token;
  // Expira 60 segundos antes do prazo real (margem de segurança)
  tokenExpiresAt = Date.now() + (res.data.expires_in - 60) * 1000;

  return cachedToken;
}

// Faz uma requisição autenticada para a API do IGDB
async function igdbRequest(endpoint, body) {
  const token = await getAccessToken();

  const res = await axios.post(
    `https://api.igdb.com/v4/${endpoint}`,
    body,
    {
      headers: {
        "Client-ID": process.env.IGDB_CLIENT_ID,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
    }
  );

  return res.data;
}

// Busca um jogo pelo ID do IGDB
async function getGameById(igdbId) {
  const games = await igdbRequest(
    "games",
    `fields name, summary, first_release_date, url, cover.url, 
     alternative_names.name, alternative_names.comment,
     platforms.name, platforms.abbreviation,
     franchises.name, genres.name;
     where id = ${igdbId};`
  );

  return games[0] || null;
}

// Busca jogos pelo slug ou URL do IGDB
async function getGameBySlug(slug) {
  const games = await igdbRequest(
    "games",
    `fields name, summary, first_release_date, url, cover.url,
     alternative_names.name, alternative_names.comment,
     platforms.name, platforms.abbreviation,
     franchises.name, genres.name;
     where slug = "${slug}";`
  );

  return games[0] || null;
}

// Busca jogos por nome (para sugestões de autocompletar)
async function searchGames(query) {
  const games = await igdbRequest(
    "games",
    `fields name, summary, first_release_date, url, cover.url;
     search "${query}";
     limit 10;`
  );

  return games;
}

// Extrai o slug de uma URL do IGDB
// Ex: https://www.igdb.com/games/crash-bandicoot-warped → crash-bandicoot-warped
function extractSlugFromUrl(url) {
  try {
    const match = url.match(/igdb\.com\/games\/([^/?#]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Formata os dados do IGDB para o formato do nosso banco
function formatGameData(igdbGame) {
  let coverUrl = null;
  if (igdbGame.cover?.url) {
    // Troca thumb por imagem grande
    coverUrl = igdbGame.cover.url
      .replace("t_thumb", "t_cover_big")
      .replace("//", "https://");
  }

  let releaseDate = null;
  if (igdbGame.first_release_date) {
    // IGDB retorna timestamp Unix
    releaseDate = new Date(igdbGame.first_release_date * 1000)
      .toISOString()
      .split("T")[0];
  }

  return {
    igdbId: igdbGame.id,
    title: igdbGame.name,
    synopsis: igdbGame.summary || null,
    initialReleaseDate: releaseDate,
    igdbUrl: igdbGame.url || null,
    coverUrl,
    platforms: igdbGame.platforms?.map((p) => p.name) || [],
    franchises: igdbGame.franchises?.map((f) => f.name) || [],
    alternativeTitles:
      igdbGame.alternative_names?.map((a) => ({
        title: a.name,
        locale: a.comment || "unknown",
      })) || [],
  };
}

module.exports = {
  getGameById,
  getGameBySlug,
  searchGames,
  extractSlugFromUrl,
  formatGameData,
};