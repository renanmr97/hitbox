import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

function AdminGamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

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
          <Link to="/admin" style={styles.back}>← Painel</Link>
          <h1 style={styles.title}>Gerenciar Jogos</h1>
        </div>
        <button
          style={styles.addButton}
          onClick={() => navigate("/admin/games/new")}
        >
          + Novo jogo
        </button>
      </div>

      <input
        style={styles.search}
        type="text"
        placeholder="Filtrar por título..."
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
            <span>Título</span>
            <span>Lançamento</span>
            <span>Ações</span>
          </div>
          {filtered.map((game) => (
            <div key={game.id} style={styles.row}>
              <span style={styles.gameTitle}>{game.title}</span>
              <span style={styles.gameDate}>
                {game.initialReleaseDate
                  ? new Date(game.initialReleaseDate).toLocaleDateString("pt-BR")
                  : "—"}
              </span>
              <div style={styles.actions}>
                <button
                  style={styles.editButton}
                  onClick={() => navigate(`/admin/games/${game.id}/edit`)}
                >
                  Editar
                </button>
                <button
                  style={deleting === game.id ? styles.deleteButtonDisabled : styles.deleteButton}
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
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  back: {
    color: "#a8a8b3",
    textDecoration: "none",
    fontSize: "0.9rem",
    display: "block",
    marginBottom: "0.25rem",
  },
  title: {
    fontSize: "1.8rem",
    color: "#e94560",
  },
  addButton: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  search: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#1a1a2e",
    border: "1px solid #e9456044",
    borderRadius: "6px",
    padding: "0.6rem 1rem",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    marginBottom: "1.5rem",
    display: "block",
  },
  table: {
    border: "1px solid #e9456022",
    borderRadius: "8px",
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 150px 180px",
    padding: "0.75rem 1rem",
    backgroundColor: "#1a1a2e",
    color: "#a8a8b3",
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 150px 180px",
    padding: "0.85rem 1rem",
    borderTop: "1px solid #e9456011",
    alignItems: "center",
  },
  gameTitle: {
    color: "#fff",
    fontSize: "0.95rem",
  },
  gameDate: {
    color: "#a8a8b3",
    fontSize: "0.85rem",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
  },
  editButton: {
    backgroundColor: "#0f3460",
    color: "#fff",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  deleteButton: {
    backgroundColor: "#e9456022",
    color: "#e94560",
    border: "1px solid #e94560",
    padding: "0.4rem 0.8rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  deleteButtonDisabled: {
    backgroundColor: "#e9456011",
    color: "#e9456088",
    border: "1px solid #e9456044",
    padding: "0.4rem 0.8rem",
    borderRadius: "4px",
    cursor: "not-allowed",
    fontSize: "0.85rem",
  },
  message: {
    color: "#a8a8b3",
    padding: "2rem",
    textAlign: "center",
  },
};

export default AdminGamesPage;