const axios = require("axios");

let cachedToken = null;
let tokenExpiresAt = null;

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
  tokenExpiresAt = Date.now() + (res.data.expires_in - 60) * 1000;

  return cachedToken;
}

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

// ==================
// JOGOS
// ==================

async function getGameById(igdbId) {
  const games = await igdbRequest(
    "games",
    `fields name, summary, first_release_date, url, cover.url,
     alternative_names.name, alternative_names.comment,
     platforms.name, platforms.abbreviation, platforms.id,
     franchises.name, franchises.id,
     genres.name, genres.id,
     release_dates.date, release_dates.platform.name,
     release_dates.platform.id, release_dates.region;
     where id = ${igdbId};`
  );

  return games[0] || null;
}

async function getGameBySlug(slug) {
  const games = await igdbRequest(
    "games",
    `fields name, summary, first_release_date, url, cover.url,
     alternative_names.name, alternative_names.comment,
     platforms.name, platforms.abbreviation, platforms.id,
     franchises.name, franchises.id,
     genres.name, genres.id,
     release_dates.date, release_dates.platform.name,
     release_dates.platform.id, release_dates.region;
     where slug = "${slug}";`
  );

  return games[0] || null;
}

async function searchGames(query) {
  const games = await igdbRequest(
    "games",
    `fields name, summary, first_release_date, url, cover.url;
     search "${query}";
     limit 10;`
  );

  return games;
}

function extractSlugFromUrl(url) {
  try {
    const match = url.match(/igdb\.com\/games\/([^/?#]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Mapa de regiões do IGDB (número → nome legível)
const IGDB_REGIONS = {
  1: "Europe",
  2: "North America",
  3: "Australia",
  4: "New Zealand",
  5: "Japan",
  6: "China",
  7: "Asia",
  8: "Worldwide",
  9: "Korea",
  10: "Brazil",
};

function formatGameData(igdbGame) {
  let coverUrl = null;
  if (igdbGame.cover?.url) {
    coverUrl = igdbGame.cover.url
      .replace("t_thumb", "t_cover_big")
      .replace("//", "https://");
  }

  let releaseDate = null;
  if (igdbGame.first_release_date) {
    releaseDate = new Date(igdbGame.first_release_date * 1000)
      .toISOString()
      .split("T")[0];
  }

  // Datas de lançamento por plataforma e região
  const releaseDates = (igdbGame.release_dates || [])
    .filter((rd) => rd.date && rd.platform)
    .map((rd) => ({
      igdbPlatformId: rd.platform.id,
      platformName: rd.platform.name,
      region: IGDB_REGIONS[rd.region] || "Worldwide",
      releaseDate: new Date(rd.date * 1000).toISOString().split("T")[0],
    }));

  return {
    igdbId: igdbGame.id,
    title: igdbGame.name,
    synopsis: igdbGame.summary || null,
    initialReleaseDate: releaseDate,
    igdbUrl: igdbGame.url || null,
    coverUrl,
    platforms: (igdbGame.platforms || []).map((p) => ({
      igdbId: p.id,
      name: p.name,
    })),
    franchises: (igdbGame.franchises || []).map((f) => ({
      igdbId: f.id,
      name: f.name,
    })),
    genres: (igdbGame.genres || []).map((g) => ({
      igdbId: g.id,
      name: g.name,
    })),
    alternativeTitles: (igdbGame.alternative_names || []).map((a) => ({
      title: a.name,
      locale: a.comment || "unknown",
    })),
    releaseDates,
  };
}

// ==================
// PLATAFORMAS
// ==================

// Mapa de tipos de plataforma do IGDB
const IGDB_PLATFORM_TYPES = {
  1: "CONSOLE",
  2: "ARCADE",
  3: "PLATFORM",
  4: "OPERATING_SYSTEM",
  5: "PORTABLE_CONSOLE",
  6: "COMPUTER",
};

async function getPlatformById(igdbId) {
  const platforms = await igdbRequest(
    "platforms",
    `fields name, abbreviation, generation, platform_logo.url,
     platform_type, versions.name;
     where id = ${igdbId};`
  );

  return platforms[0] || null;
}

async function getPlatformBySlug(slug) {
  const platforms = await igdbRequest(
    "platforms",
    `fields name, abbreviation, generation, platform_logo.url,
     platform_type, versions.name;
     where slug = "${slug}";`
  );

  return platforms[0] || null;
}

async function searchPlatforms(query) {
  const platforms = await igdbRequest(
    "platforms",
    `fields name, abbreviation, generation, platform_logo.url, platform_type;
     search "${query}";
     limit 10;`
  );

  return platforms;
}

function extractPlatformSlugFromUrl(url) {
  try {
    const match = url.match(/igdb\.com\/platforms\/([^/?#]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function formatPlatformData(igdbPlatform) {
  let logoUrl = null;
  if (igdbPlatform.platform_logo?.url) {
    logoUrl = igdbPlatform.platform_logo.url
      .replace("t_thumb", "t_logo_med")
      .replace("//", "https://");
  }

  return {
    igdbId: igdbPlatform.id,
    name: igdbPlatform.name,
    logoUrl,
    generation: igdbPlatform.generation || null,
    platformType: IGDB_PLATFORM_TYPES[igdbPlatform.platform_type] || null,
  };
}

module.exports = {
  // jogos
  getGameById,
  getGameBySlug,
  searchGames,
  extractSlugFromUrl,
  formatGameData,
  // plataformas
  getPlatformById,
  getPlatformBySlug,
  searchPlatforms,
  extractPlatformSlugFromUrl,
  formatPlatformData,
};