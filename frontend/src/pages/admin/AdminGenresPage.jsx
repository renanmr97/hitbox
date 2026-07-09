import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function AdminGenresPage() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState(null); // genre sendo editado
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  async function fetchGenres() {
    try {
      const res = await api.get("/genres");
      setGenres(res.data);
    } catch {
      setError("Erro ao carregar gêneros.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(genre) {
    setEditing(genre);
    setForm({ name: genre.name });
    setError(null);
  }

  function handleCancelEdit() {
    setEditing(null);
    setForm({ name: "" });
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      if (editing) {
        const res = await api.put(`/genres/${editing.id}`, form);
        setGenres((prev) =>
          prev.map((g) => (g.id === editing.id ? res.data : g))
        );
        setEditing(null);
      } else {
        const res = await api.post("/genres", form);
        setGenres((prev) =>
          [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name))
        );
      }
      setForm({ name: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao salvar gênero.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(genre) {
    if (!confirm(`Deletar o gênero "${genre.name}"?`)) return;

    try {
      await api.delete(`/genres/${genre.id}`);
      setGenres((prev) => prev.filter((g) => g.id !== genre.id));
    } catch {
      setError("Erro ao deletar gênero.");
    }
  }

  const filtered = genres.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <Link to="/admin" style={styles.back}>← Painel</Link>
          <h1 style={styles.title}>Gêneros</h1>
        </div>
      </div>

      {/* Formulário de criação/edição */}
      <div style={styles.formBlock}>
        <h3 style={styles.formTitle}>
          {editing ? `Editando: ${editing.name}` : "Novo gênero"}
        </h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            placeholder="Nome do gênero (ex: Action, RPG, Platformer...)"
            required
          />
          <div style={styles.formActions}>
            {editing && (
              <button
                type="button"
                style={styles.cancelButton}
                onClick={handleCancelEdit}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              style={submitting ? styles.submitDisabled : styles.submitButton}
              disabled={submitting}
            >
              {submitting
                ? "Salvando..."
                : editing
                ? "Salvar alteração"
                : "Adicionar gênero"}
            </button>
          </div>
        </form>
        {error && <p style={styles.error}>{error}</p>}
      </div>

      {/* Lista de gêneros */}
      <input
        style={styles.search}
        type="text"
        placeholder="Filtrar gêneros..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p style={styles.message}>Carregando...</p>
      ) : filtered.length === 0 ? (
        <p style={styles.message}>Nenhum gênero encontrado.</p>
      ) : (
        <div style={styles.list}>
          {filtered.map((genre) => (
            <div key={genre.id} style={styles.row}>
              <span style={styles.genreName}>{genre.name}</span>
              {genre.igdbId && (
                <span style={styles.igdbBadge}>IGDB #{genre.igdbId}</span>
              )}
              <div style={styles.actions}>
                <button
                  style={styles.editButton}
                  onClick={() => handleEdit(genre)}
                >
                  Editar
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(genre)}
                >
                  Deletar
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
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "2rem",
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
  formBlock: {
    backgroundColor: "#1a1a2e",
    border: "1px solid #e9456033",
    borderRadius: "10px",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  formTitle: {
    color: "#a8a8b3",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  input: {
    backgroundColor: "#16213e",
    border: "1px solid #e9456044",
    borderRadius: "6px",
    padding: "0.75rem 1rem",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
  },
  formActions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
  },
  cancelButton: {
    background: "none",
    border: "1px solid #e9456044",
    color: "#a8a8b3",
    padding: "0.6rem 1.25rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  submitButton: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.6rem 1.25rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "bold",
  },
  submitDisabled: {
    backgroundColor: "#e9456088",
    color: "#fff",
    border: "none",
    padding: "0.6rem 1.25rem",
    borderRadius: "6px",
    cursor: "not-allowed",
    fontSize: "0.95rem",
    fontWeight: "bold",
  },
  error: {
    color: "#e94560",
    fontSize: "0.85rem",
    marginTop: "0.75rem",
    backgroundColor: "#e9456022",
    padding: "0.5rem 0.75rem",
    borderRadius: "4px",
  },
  search: {
    width: "100%",
    backgroundColor: "#1a1a2e",
    border: "1px solid #e9456044",
    borderRadius: "6px",
    padding: "0.6rem 1rem",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    marginBottom: "1rem",
    display: "block",
    boxSizing: "border-box",
  },
  list: {
    border: "1px solid #e9456022",
    borderRadius: "8px",
    overflow: "hidden",
  },
  row: {
    display: "flex",
    alignItems: "center",
    padding: "0.85rem 1rem",
    borderTop: "1px solid #e9456011",
    gap: "1rem",
  },
  genreName: {
    color: "#fff",
    flex: 1,
    fontSize: "0.95rem",
  },
  igdbBadge: {
    backgroundColor: "#0f3460",
    color: "#a8a8b3",
    fontSize: "0.75rem",
    padding: "0.2rem 0.5rem",
    borderRadius: "4px",
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
  message: {
    color: "#a8a8b3",
    padding: "2rem",
    textAlign: "center",
  },
};

export default AdminGenresPage;