import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api/axios";

function AdminGameFormPage() {
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

  const [igdbInput, setIgdbInput] = useState("");
  const [igdbLoading, setIgdbLoading] = useState(false);
  const [igdbError, setIgdbError] = useState(null);
  const [igdbPreview, setIgdbPreview] = useState(null);

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

  async function handleIgdbLookup() {
    if (!igdbInput.trim()) return;
    setIgdbLoading(true);
    setIgdbError(null);
    setIgdbPreview(null);

    try {
      const isId = /^\d+$/.test(igdbInput.trim());
      const params = isId
        ? `id=${igdbInput.trim()}`
        : `url=${encodeURIComponent(igdbInput.trim())}`;

      const res = await api.get(`/igdb/lookup?${params}`);
      const data = res.data;

      setIgdbPreview(data);

      // Pré-preenche o formulário com os dados do IGDB
      setForm({
        title: data.title || "",
        synopsis: data.synopsis || "",
        initialReleaseDate: data.initialReleaseDate || "",
        igdbUrl: data.igdbUrl || "",
        wikipediaUrl: "",
      });
    } catch (err) {
      setIgdbError(
        err.response?.data?.error || "Erro ao buscar no IGDB."
      );
    } finally {
      setIgdbLoading(false);
    }
  }

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
      navigate("/admin/games");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao salvar jogo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p style={styles.message}>Carregando...</p>;

  return (
    <div style={styles.container}>
      <Link to="/admin/games" style={styles.back}>← Voltar para jogos</Link>
      <h1 style={styles.title}>
        {isEditing ? "Editar jogo" : "Novo jogo"}
      </h1>

      {/* Bloco de importação do IGDB — só no cadastro */}
      {!isEditing && (
        <div style={styles.igdbBlock}>
          <h3 style={styles.igdbTitle}>🎮 Importar dados do IGDB</h3>
          <p style={styles.igdbHint}>
            Cole a URL ou o ID numérico do jogo no IGDB para pré-preencher o formulário automaticamente.
          </p>
          <div style={styles.igdbRow}>
            <input
              style={styles.igdbInput}
              type="text"
              value={igdbInput}
              onChange={(e) => setIgdbInput(e.target.value)}
              placeholder="https://www.igdb.com/games/crash-bandicoot-warped ou 426"
              onKeyDown={(e) => e.key === "Enter" && handleIgdbLookup()}
            />
            <button
              type="button"
              style={igdbLoading ? styles.igdbButtonDisabled : styles.igdbButton}
              onClick={handleIgdbLookup}
              disabled={igdbLoading}
            >
              {igdbLoading ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {igdbError && <p style={styles.igdbError}>{igdbError}</p>}

          {igdbPreview && (
            <div style={styles.igdbPreview}>
              <p style={styles.igdbPreviewText}>
                ✅ <strong>{igdbPreview.title}</strong> encontrado!
                {igdbPreview.coverUrl && (
                  <img
                    src={igdbPreview.coverUrl}
                    alt={igdbPreview.title}
                    style={styles.igdbCover}
                  />
                )}
              </p>
              <p style={styles.igdbPreviewHint}>
                Os campos abaixo foram preenchidos automaticamente. Revise e edite antes de salvar.
              </p>
            </div>
          )}
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Título *</label>
          <input
            style={styles.input}
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
          <label style={styles.label}>Data de lançamento</label>
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
            onClick={() => navigate("/admin/games")}
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
    maxWidth: "640px",
    margin: "0 auto",
  },
  back: {
    color: "#a8a8b3",
    textDecoration: "none",
    fontSize: "0.9rem",
    display: "block",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "1.8rem",
    color: "#e94560",
    marginBottom: "2rem",
  },
  igdbBlock: {
    backgroundColor: "#1a1a2e",
    border: "1px solid #e9456044",
    borderRadius: "10px",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  igdbTitle: {
    color: "#e94560",
    fontSize: "1rem",
    marginBottom: "0.4rem",
  },
  igdbHint: {
    color: "#a8a8b3",
    fontSize: "0.85rem",
    marginBottom: "1rem",
    lineHeight: "1.5",
  },
  igdbRow: {
    display: "flex",
    gap: "0.5rem",
  },
  igdbInput: {
    flex: 1,
    backgroundColor: "#16213e",
    border: "1px solid #e9456044",
    borderRadius: "6px",
    padding: "0.65rem 1rem",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
  },
  igdbButton: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.65rem 1.25rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
    flexShrink: 0,
  },
  igdbButtonDisabled: {
    backgroundColor: "#e9456088",
    color: "#fff",
    border: "none",
    padding: "0.65rem 1.25rem",
    borderRadius: "6px",
    cursor: "not-allowed",
    fontSize: "0.9rem",
    fontWeight: "bold",
    flexShrink: 0,
  },
  igdbError: {
    color: "#e94560",
    fontSize: "0.85rem",
    marginTop: "0.75rem",
    backgroundColor: "#e9456022",
    padding: "0.5rem 0.75rem",
    borderRadius: "4px",
  },
  igdbPreview: {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "#16213e",
    borderRadius: "6px",
    border: "1px solid #1a7a4a",
  },
  igdbPreviewText: {
    color: "#fff",
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  igdbCover: {
    height: "60px",
    borderRadius: "4px",
  },
  igdbPreviewHint: {
    color: "#a8a8b3",
    fontSize: "0.8rem",
    marginTop: "0.5rem",
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
    gap: "1.5rem",
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
    gap: "1rem",
    justifyContent: "flex-end",
    paddingTop: "0.5rem",
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

export default AdminGameFormPage;