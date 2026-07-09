import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/games")
      .then((res) => {
        setGames(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Não foi possível carregar os jogos.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={styles.message}>Carregando jogos...</p>;
  if (error) return <p style={styles.message}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Jogos</h1>
      {games.length === 0 ? (
        <p style={styles.message}>Nenhum jogo cadastrado ainda.</p>
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
    marginBottom: "2rem",
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
    transition: "border-color 0.2s, transform 0.2s",
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
  message: {
    padding: "2rem",
    color: "#a8a8b3",
    textAlign: "center",
  },
};

export default GamesPage;