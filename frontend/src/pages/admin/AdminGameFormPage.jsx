import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

function AdminGameForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    synopsis: "",
    initialReleaseDate: "",
    igdbUrl: "",
    wikipediaUrl: "",
  });
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditing) return;

    api.get(`/games/${id}`)
      .then((res) => {
        const g = res.data;
        setForm({
          title: g.title || "",
          synopsis: g.synopsis || "",
          initialReleaseDate: g.initialReleaseDate
            ? g.initialReleaseDate.split("T")[0]
            : "",
          igdbUrl: g.igdbUrl || "",
          wikipediaUrl: g.wikipediaUrl || "",
        });
      })
      .catch(() => setError("Erro ao carregar jogo."))
      .finally(() => setLoading(false));
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isEditing) {
        await api.put(`/games/${id}`, form);
      } else {
        await api.post("/games", form);
      }
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao salvar jogo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p style={styles.message}>Carregando...</p>;

  return (
    <div style={styles.container}>
      <button
        style={styles.backButton}
        onClick={() => navigate("/admin")}
      >
        ← Voltar ao painel
      </button>

      <h1 style={styles.title}>
        {isEditing ? "Editar jogo" : "Novo jogo"}
      </h1>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Título *</label>
          <input
            style={styles.input}
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ex: Crash Bandicoot: Warped"
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Sinopse</label>
          <textarea
            style={styles.textarea}
            name="synopsis"
            value={form.synopsis}
            onChange={handleChange}
            placeholder="Descrição do jogo..."
            rows={4}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Data de lançamento inicial</label>
          <input
            style={styles.input}
            type="date"
            name="initialReleaseDate"
            value={form.initialReleaseDate}
            onChange={handleChange}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>URL do IGDB</label>
          <input
            style={styles.input}
            type="url"
            name="igdbUrl"
            value={form.igdbUrl}
            onChange={handleChange}
            placeholder="https://igdb.com/games/..."
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>URL da Wikipedia</label>
          <input
            style={styles.input}
            type="url"
            name="wikipediaUrl"
            value={form.wikipediaUrl}
            onChange={handleChange}
            placeholder="https://en.wikipedia.org/wiki/..."
          />
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            style={styles.cancelButton}
            onClick={() => navigate("/admin")}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={submitting ? styles.submitDisabled : styles.submitButton}
            disabled={submitting}
          >
            {submitting
              ? "Salvando..."
              : isEditing
              ? "Salvar alterações"
              : "Criar jogo"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#16213e",
    minHeight: "100vh",
    color: "#fff",
    maxWidth: "600px",
    margin: "0 auto",
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
  title: {
    fontSize: "1.8rem",
    color: "#e94560",
    marginBottom: "2rem",
  },
  error: {
    backgroundColor: "#e9456022",
    border: "1px solid #e94560",
    color: "#e94560",
    padding: "0.75rem 1rem",
    borderRadius: "6px",
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    color: "#a8a8b3",
    fontSize: "0.85rem",
  },
  input: {
    backgroundColor: "#1a1a2e",
    border: "1px solid #e9456044",
    borderRadius: "6px",
    padding: "0.75rem 1rem",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
  },
  textarea: {
    backgroundColor: "#1a1a2e",
    border: "1px solid #e9456044",
    borderRadius: "6px",
    padding: "0.75rem 1rem",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
    marginTop: "0.5rem",
  },
  cancelButton: {
    background: "none",
    border: "1px solid #e9456044",
    color: "#a8a8b3",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  submitButton: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  submitDisabled: {
    backgroundColor: "#e9456088",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "not-allowed",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  message: {
    padding: "2rem",
    color: "#a8a8b3",
    textAlign: "center",
  },
};

export default AdminGameForm;