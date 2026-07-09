import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const STATUS_LABELS = {
  WANT_TO_PLAY: "Quero jogar",
  PLAYING: "Jogando",
  PLAYED: "Joguei",
};

const STATUS_COLORS = {
  WANT_TO_PLAY: "#0f3460",
  PLAYING: "#e94560",
  PLAYED: "#1a7a4a",
};

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("WANT_TO_PLAY");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    api.get("/users/me")
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [user]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (loading) return <p style={styles.message}>Carregando perfil...</p>;
  if (!profile) return <p style={styles.message}>Erro ao carregar perfil.</p>;

  const itemsByStatus = profile.listItems.filter(
    (item) => item.status === activeTab
  );

  return (
    <div style={styles.container}>
      {/* Cabeçalho do perfil */}
      <div style={styles.header}>
        <div style={styles.avatar}>
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <div style={styles.headerInfo}>
          <h1 style={styles.username}>{profile.username}</h1>
          <p style={styles.email}>{profile.email}</p>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <span style={styles.statNumber}>{profile._count.listItems}</span>
              <span style={styles.statLabel}>jogos na lista</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>{profile._count.reviews}</span>
              <span style={styles.statLabel}>avaliações</span>
            </div>
          </div>
        </div>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Sair
        </button>
      </div>

      {/* Abas de status */}
      <div style={styles.tabs}>
        {Object.entries(STATUS_LABELS).map(([status, label]) => {
          const count = profile.listItems.filter(
            (i) => i.status === status
          ).length;
          return (
            <button
              key={status}
              style={
                activeTab === status ? styles.tabActive : styles.tab
              }
              onClick={() => setActiveTab(status)}
            >
              {label}
              <span style={styles.tabCount}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Lista de jogos */}
      {itemsByStatus.length === 0 ? (
        <div style={styles.empty}>
          <p>Nenhum jogo em "{STATUS_LABELS[activeTab]}" ainda.</p>
          <button
            style={styles.browseButton}
            onClick={() => navigate("/games")}
          >
            Explorar jogos
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {itemsByStatus.map((item) => {
            const cover =
              item.game.covers?.find((c) => c.isPrimary) ||
              item.game.covers?.[0];
            return (
              <div
                key={item.id}
                style={styles.card}
                onClick={() => navigate(`/games/${item.game.id}`)}
              >
                {cover ? (
                  <img
                    src={cover.imageUrl}
                    alt={item.game.title}
                    style={styles.cardCover}
                  />
                ) : (
                  <div style={styles.noCover}>
                    🎮
                  </div>
                )}
                <div style={styles.cardInfo}>
                  <h3 style={styles.cardTitle}>{item.game.title}</h3>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: STATUS_COLORS[item.status],
                    }}
                  >
                    {STATUS_LABELS[item.status]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Avaliações recentes */}
      {profile.reviews.length > 0 && (
        <div style={styles.reviewsSection}>
          <h2 style={styles.sectionTitle}>Avaliações recentes</h2>
          {profile.reviews.map((review) => (
            <div
              key={review.id}
              style={styles.reviewCard}
              onClick={() => navigate(`/games/${review.game.id}`)}
            >
              <div style={styles.reviewHeader}>
                <span style={styles.reviewGame}>{review.game.title}</span>
                <span style={styles.reviewRating}>⭐ {review.rating}/10</span>
              </div>
              {review.comment && (
                <p style={styles.reviewComment}>{review.comment}</p>
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
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1.5rem",
    marginBottom: "2.5rem",
    flexWrap: "wrap",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#e94560",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    flexShrink: 0,
  },
  headerInfo: {
    flex: 1,
  },
  username: {
    fontSize: "1.8rem",
    color: "#fff",
    marginBottom: "0.25rem",
  },
  email: {
    color: "#a8a8b3",
    fontSize: "0.9rem",
    marginBottom: "1rem",
  },
  stats: {
    display: "flex",
    gap: "2rem",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
  },
  statNumber: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#e94560",
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "#a8a8b3",
  },
  logoutButton: {
    background: "none",
    border: "1px solid #e9456066",
    color: "#e94560",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    alignSelf: "flex-start",
  },
  tabs: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "2rem",
    borderBottom: "1px solid #e9456022",
    paddingBottom: "0",
    flexWrap: "wrap",
  },
  tab: {
    background: "none",
    border: "none",
    color: "#a8a8b3",
    padding: "0.75rem 1.25rem",
    cursor: "pointer",
    fontSize: "0.95rem",
    borderBottom: "2px solid transparent",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  tabActive: {
    background: "none",
    border: "none",
    color: "#e94560",
    padding: "0.75rem 1.25rem",
    cursor: "pointer",
    fontSize: "0.95rem",
    borderBottom: "2px solid #e94560",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "bold",
  },
  tabCount: {
    backgroundColor: "#e9456033",
    color: "#e94560",
    padding: "0.1rem 0.4rem",
    borderRadius: "10px",
    fontSize: "0.75rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "1rem",
    marginBottom: "3rem",
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid #e9456022",
    transition: "border-color 0.2s",
  },
  cardCover: {
    width: "100%",
    aspectRatio: "3/4",
    objectFit: "cover",
  },
  noCover: {
    width: "100%",
    aspectRatio: "3/4",
    backgroundColor: "#16213e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
  },
  cardInfo: {
    padding: "0.75rem",
  },
  cardTitle: {
    fontSize: "0.85rem",
    color: "#fff",
    marginBottom: "0.4rem",
    lineHeight: "1.3",
  },
  statusBadge: {
    fontSize: "0.7rem",
    color: "#fff",
    padding: "0.2rem 0.5rem",
    borderRadius: "4px",
  },
  empty: {
    textAlign: "center",
    color: "#a8a8b3",
    padding: "3rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
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
  reviewsSection: {
    marginTop: "1rem",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    color: "#e94560",
    marginBottom: "1rem",
  },
  reviewCard: {
    backgroundColor: "#1a1a2e",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "0.75rem",
    border: "1px solid #e9456022",
    cursor: "pointer",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  reviewGame: {
    color: "#fff",
    fontWeight: "bold",
  },
  reviewRating: {
    color: "#e94560",
    fontWeight: "bold",
  },
  reviewComment: {
    color: "#a8a8b3",
    fontSize: "0.9rem",
    lineHeight: "1.5",
  },
  message: {
    padding: "2rem",
    color: "#a8a8b3",
    textAlign: "center",
  },
};

export default ProfilePage;