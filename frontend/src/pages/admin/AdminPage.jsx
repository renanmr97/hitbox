import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function AdminPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  async function fetchGames() {
    try {
      const res = await api.get("/games");
      setGames(res.data);
    } catch {
      // erro silencioso
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(game) {
    if (!confirm(`Deletar "${game.title}"? Essa ação não pode ser desfeita.`)) return;

    setDeleting(game.id);
    try {
      await api.delete(`/games/${game.id}`);
      setGames((prev) => prev.filter((g) => g.id !== game.id));
    } catch {
      alert("Erro ao deletar jogo.");
    } finally {
      setDeleting(null);
    }
  }

  const filtered = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Painel Administrativo</h1>
          <p style={styles.subtitle}>{games.length} jogos cadastrados</p>
        </div>
        <button
          style={styles.newButton}
          onClick={() => navigate("/admin/games/new")}
        >
          + Novo jogo
        </button>
      </div>

      <input
        style={styles.searchInput}
        type="text"
        placeholder="Filtrar jogos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p style={styles.message}>Carregando...</p>
      ) : filtered.length === 0 ? (
        <p style={styles.message}>Nenhum jogo encontrado.</p>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span style={styles.colTitle}>Título</span>
            <span style={styles.colDate}>Lançamento</span>
            <span style={styles.colActions}>Ações</span>
          </div>

          {filtered.map((game) => (
            <div key={game.id} style={styles.tableRow}>
              <span style={styles.colTitle}>{game.title}</span>
              <span style={styles.colDate}>
                {game.initialReleaseDate
                  ? new Date(game.initialReleaseDate).toLocaleDateString("pt-BR")
                  : "—"}
              </span>
              <div style={styles.colActions}>
                <button
                  style={styles.viewButton}
                  onClick={() => navigate(`/games/${game.id}`)}
                >
                  Ver
                </button>
                <button
                  style={styles.editButton}
                  onClick={() => navigate(`/admin/games/${game.id}/edit`)}
                >
                  Editar
                </button>
                <button
                  style={deleting === game.id ? styles.deleteDisabled : styles.deleteButton}
                  onClick={() => handleDelete(game)}
                  disabled={deleting === game.id}
                >
                  {deleting === game.id ? "..." : "Deletar"}
                </button>
              </div>
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
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  title: {
    fontSize: "1.8rem",
    color: "#e94560",
    marginBottom: "0.25rem",
  },
  subtitle: {
    color: "#a8a8b3",
    fontSize: "0.9rem",
  },
  newButton: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  searchInput: {
    width: "100%",
    backgroundColor: "#1a1a2e",
    border: "1px solid #e9456044",
    borderRadius: "6px",
    padding: "0.75rem 1rem",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    marginBottom: "1.5rem",
    boxSizing: "border-box",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
    border: "1px solid #e9456022",
    borderRadius: "8px",
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 150px 200px",
    padding: "0.75rem 1rem",
    backgroundColor: "#1a1a2e",
    color: "#a8a8b3",
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 150px 200px",
    padding: "0.9rem 1rem",
    borderTop: "1px solid #e9456011",
    alignItems: "center",
    transition: "background 0.15s",
  },
  colTitle: {
    color: "#fff",
    fontSize: "0.95rem",
  },
  colDate: {
    color: "#a8a8b3",
    fontSize: "0.9rem",
  },
  colActions: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-end",
  },
  viewButton: {
    background: "none",
    border: "1px solid #e9456044",
    color: "#a8a8b3",
    padding: "0.3rem 0.7rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  editButton: {
    background: "none",
    border: "1px solid #e9456088",
    color: "#e94560",
    padding: "0.3rem 0.7rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  deleteButton: {
    backgroundColor: "#e9456022",
    border: "1px solid #e94560",
    color: "#e94560",
    padding: "0.3rem 0.7rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  deleteDisabled: {
    backgroundColor: "#e9456011",
    border: "1px solid #e9456044",
    color: "#e9456066",
    padding: "0.3rem 0.7rem",
    borderRadius: "4px",
    cursor: "not-allowed",
    fontSize: "0.8rem",
  },
  message: {
    color: "#a8a8b3",
    textAlign: "center",
    padding: "3rem",
  },
};

export default AdminPage;