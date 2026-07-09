import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

function AdminPage() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    games: 0,
    platforms: 0,
    genres: 0,
  });

  useEffect(() => {
    Promise.all([
      api.get("/games"),
      api.get("/platforms"),
      api.get("/genres"),
    ]).then(([games, platforms, genres]) => {
      setCounts({
        games: games.data.length,
        platforms: platforms.data.length,
        genres: genres.data.length,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    {
      to: "/admin/games",
      icon: "🎮",
      title: "Jogos",
      desc: "Adicionar, editar e remover jogos do catálogo",
      count: counts.games,
      countLabel: "cadastrados",
    },
    {
      to: "/admin/platforms",
      icon: "🕹️",
      title: "Plataformas",
      desc: "Gerenciar consoles e plataformas com integração IGDB",
      count: counts.platforms,
      countLabel: "cadastradas",
    },
    {
      to: "/admin/genres",
      icon: "🏷️",
      title: "Gêneros",
      desc: "Gerenciar gêneros de jogos",
      count: counts.genres,
      countLabel: "cadastrados",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Painel Administrativo</h1>
          <p style={styles.welcome}>Olá, {user?.username}!</p>
        </div>
      </div>

      <div style={styles.grid}>
        {cards.map((card) => (
          <Link key={card.to} to={card.to} style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.cardIcon}>{card.icon}</span>
              <span style={styles.cardCount}>
                {card.count} {card.countLabel}
              </span>
            </div>
            <h2 style={styles.cardTitle}>{card.title}</h2>
            <p style={styles.cardDesc}>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#16213e",
    minHeight: "100vh",
    color: "#fff",
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "2.5rem",
  },
  title: {
    fontSize: "2rem",
    color: "#e94560",
    marginBottom: "0.25rem",
  },
  welcome: {
    color: "#a8a8b3",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#1a1a2e",
    border: "1px solid #e9456033",
    borderRadius: "12px",
    padding: "1.75rem",
    textDecoration: "none",
    color: "#fff",
    display: "block",
    transition: "border-color 0.2s",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  cardIcon: {
    fontSize: "2rem",
  },
  cardCount: {
    color: "#e94560",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: "1.2rem",
    color: "#e94560",
    marginBottom: "0.5rem",
  },
  cardDesc: {
    color: "#a8a8b3",
    fontSize: "0.9rem",
    lineHeight: "1.5",
  },
};

export default AdminPage;