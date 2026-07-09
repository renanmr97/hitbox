import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url = search ? `/games?search=${encodeURIComponent(search)}` : "/games";

    api.get(url)
      .then((res) => {
        setGames(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Não foi possível carregar os jogos.");
        setLoading(false);
      });
  }, [search]);

  if (loading) return <p style={styles.message}>Carregando jogos...</p>;
  if (error) return <p style={styles.message}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {search ? `Resultados para "${search}"` : "Jogos"}
      </h1>

      {search && (
        <button
          style={styles.clearButton}
          onClick={() => navigate("/games")}
        >
          ← Ver todos os jogos
        </button>
      )}

      {games.length === 0 ? (
        <div style={styles.empty}>
          <p>
            {search
              ? `Nenhum jogo encontrado para "${search}".`
              : "Nenhum jogo cadastrado ainda."}
          </p>
          {search && (
            <button
              style={styles.browseButton}
              onClick={() => navigate("/games")}
            >
              Ver todos os jogos
            </button>
          )}
        </div>
      ) : (
        <div style={styles.grid}>
          {games.map((game) => (
            <div
              key={game.id}
              style={styles.card}
              onClick={() => navigate(`/games/${game.id}`)}
            >
              <h2 style={styles.cardTitle}>{game.title}</h2>
              {game.synopsis && (
                <p style={styles.cardSynopsis}>{game.synopsis}</p>
              )}
              {game.initialReleaseDate && (
                <p style={styles.cardDate}>
                  Lançamento:{" "}
                  {new Date(game.initialReleaseDate).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#16213e",
    minHeight: "100vh",
    color: "#fff",
  },
  title: {
    fontSize: "2rem",
    color: "#e94560",
    marginBottom: "1rem",
  },
  clearButton: {
    background: "none",
    border: "none",
    color: "#a8a8b3",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginBottom: "1.5rem",
    padding: "0",
    textDecoration: "underline",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: "8px",
    padding: "1.5rem",
    border: "1px solid #e9456033",
    cursor: "pointer",
  },
  cardTitle: {
    fontSize: "1.2rem",
    color: "#e94560",
    marginBottom: "0.5rem",
  },
  cardSynopsis: {
    fontSize: "0.9rem",
    color: "#a8a8b3",
    marginBottom: "0.5rem",
  },
  cardDate: {
    fontSize: "0.8rem",
    color: "#666",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "3rem",
    color: "#a8a8b3",
  },
  browseButton: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  message: {
    padding: "2rem",
    color: "#a8a8b3",
    textAlign: "center",
  },
};

export default GamesPage;