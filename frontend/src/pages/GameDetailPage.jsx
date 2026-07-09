import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/games/${id}`)
      .then((res) => {
        setGame(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Jogo não encontrado.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={styles.message}>Carregando...</p>;
  if (error) return (
    <div style={styles.errorContainer}>
      <p style={styles.message}>{error}</p>
      <button style={styles.button} onClick={() => navigate("/games")}>
        Voltar para Jogos
      </button>
    </div>
  );

  const primaryCover = game.covers?.find((c) => c.isPrimary) || game.covers?.[0];

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate("/games")}>
        ← Voltar
      </button>

      <div style={styles.content}>
        {/* Capa */}
        <div style={styles.coverWrapper}>
          {primaryCover ? (
            <img
              src={primaryCover.imageUrl}
              alt={`Capa de ${game.title}`}
              style={styles.cover}
            />
          ) : (
            <div style={styles.noCover}>Sem capa</div>
          )}
        </div>

        {/* Informações */}
        <div style={styles.info}>
          <h1 style={styles.title}>{game.title}</h1>

          {game.localizedTitles?.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Títulos alternativos</h3>
              <ul style={styles.list}>
                {game.localizedTitles.map((lt) => (
                  <li key={lt.id} style={styles.listItem}>
                    {lt.title}{" "}
                    <span style={styles.badge}>{lt.locale}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {game.synopsis && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Sinopse</h3>
              <p style={styles.synopsis}>{game.synopsis}</p>
            </div>
          )}

          {game.initialReleaseDate && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Lançamento inicial</h3>
              <p style={styles.text}>
                {new Date(game.initialReleaseDate).toLocaleDateString("pt-BR")}
              </p>
            </div>
          )}

          {game.gamePlatforms?.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Plataformas</h3>
              <div style={styles.tags}>
                {game.gamePlatforms.map((gp) => (
                  <span key={gp.id} style={styles.tag}>
                    {gp.platform.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {game.gameFranchises?.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Franquias</h3>
              <div style={styles.tags}>
                {game.gameFranchises.map((gf) => (
                  <span key={gf.id} style={styles.tag}>
                    {gf.franchise.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Links externos</h3>
            <div style={styles.externalLinks}>
              {game.igdbUrl ? (
                <a href={game.igdbUrl} target="_blank" rel="noreferrer" style={styles.link}>
                  IGDB
                </a>
              ) : null}
              {game.wikipediaUrl ? (
                <a href={game.wikipediaUrl} target="_blank" rel="noreferrer" style={styles.link}>
                  Wikipedia
                </a>
              ) : null}
              {!game.igdbUrl && !game.wikipediaUrl && (
                <p style={styles.text}>Nenhum link disponível.</p>
              )}
            </div>
          </div>

          {game.reviews?.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                Avaliações ({game.reviews.length})
              </h3>
              {game.reviews.map((review) => (
                <div key={review.id} style={styles.review}>
                  <span style={styles.rating}>⭐ {review.rating}/10</span>
                  {review.comment && (
                    <p style={styles.reviewComment}>{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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
  },
  backButton: {
    background: "none",
    border: "1px solid #e94560",
    color: "#e94560",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginBottom: "2rem",
  },
  content: {
    display: "flex",
    gap: "3rem",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  coverWrapper: {
    flexShrink: 0,
  },
  cover: {
    width: "220px",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  },
  noCover: {
    width: "220px",
    height: "300px",
    backgroundColor: "#1a1a2e",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#a8a8b3",
    fontSize: "0.9rem",
    border: "1px solid #e9456033",
  },
  info: {
    flex: 1,
    minWidth: "280px",
  },
  title: {
    fontSize: "2.2rem",
    color: "#e94560",
    marginBottom: "1.5rem",
  },
  section: {
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    fontSize: "0.8rem",
    color: "#a8a8b3",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "0.5rem",
  },
  synopsis: {
    color: "#ccc",
    lineHeight: "1.7",
  },
  text: {
    color: "#ccc",
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  tag: {
    backgroundColor: "#1a1a2e",
    border: "1px solid #e9456055",
    color: "#e94560",
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
  },
  badge: {
    backgroundColor: "#0f3460",
    color: "#a8a8b3",
    padding: "0.1rem 0.4rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    marginLeft: "0.5rem",
  },
  list: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  listItem: {
    color: "#ccc",
  },
  externalLinks: {
    display: "flex",
    gap: "1rem",
  },
  link: {
    color: "#e94560",
    textDecoration: "none",
    border: "1px solid #e94560",
    padding: "0.3rem 0.8rem",
    borderRadius: "4px",
    fontSize: "0.85rem",
  },
  review: {
    backgroundColor: "#1a1a2e",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "0.75rem",
    border: "1px solid #e9456022",
  },
  rating: {
    color: "#e94560",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  reviewComment: {
    color: "#ccc",
    marginTop: "0.5rem",
    lineHeight: "1.5",
  },
  button: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "1rem",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
  },
  message: {
    padding: "2rem",
    color: "#a8a8b3",
    textAlign: "center",
    fontSize: "1.1rem",
  },
};

export default GameDetailPage;