import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const PLATFORM_TYPE_LABELS = {
  CONSOLE: "Console",
  ARCADE: "Arcade",
  PLATFORM: "Plataforma",
  OPERATING_SYSTEM: "Sistema Operacional",
  PORTABLE_CONSOLE: "Console Portátil",
  COMPUTER: "Computador",
};

function AdminPlatformsPage() {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  // Formulário manual / edição
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    generation: "",
    platformType: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Importação IGDB
  const [igdbInput, setIgdbInput] = useState("");
  const [igdbLoading, setIgdbLoading] = useState(false);
  const [igdbError, setIgdbError] = useState(null);
  const [igdbPreview, setIgdbPreview] = useState(null);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  async function fetchPlatforms() {
    try {
      const res = await api.get("/platforms");
      setPlatforms(res.data);
    } catch {
      setError("Erro ao carregar plataformas.");
    } finally {
      setLoading(false);
    }
  }

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

      const res = await api.get(`/igdb/platforms/lookup?${params}`);
      const data = res.data;

      setIgdbPreview(data);
      setForm({
        name: data.name || "",
        logoUrl: data.logoUrl || "",
        generation: data.generation ? String(data.generation) : "",
        platformType: data.platformType || "",
      });
      setEditing(null);
    } catch (err) {
      setIgdbError(err.response?.data?.error || "Erro ao buscar no IGDB.");
    } finally {
      setIgdbLoading(false);
    }
  }

  function handleEdit(platform) {
    setEditing(platform);
    setForm({
      name: platform.name || "",
      logoUrl: platform.logoUrl || "",
      generation: platform.generation ? String(platform.generation) : "",
      platformType: platform.platformType || "",
    });
    setIgdbPreview(null);
    setIgdbInput("");
    setFormError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() {
    setEditing(null);
    setIgdbPreview(null);
    setIgdbInput("");
    setForm({ name: "", logoUrl: "", generation: "", platformType: "" });
    setFormError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        name: form.name,
        logoUrl: form.logoUrl || null,
        generation: form.generation ? parseInt(form.generation) : null,
        platformType: form.platformType || null,
        igdbId: igdbPreview?.igdbId || null,
      };

      if (editing) {
        const res = await api.put(`/platforms/${editing.id}`, payload);
        setPlatforms((prev) =>
          prev.map((p) => (p.id === editing.id ? res.data : p))
        );
        setEditing(null);
      } else {
        const res = await api.post("/platforms", payload);
        setPlatforms((prev) =>
          [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name))
        );
      }

      setForm({ name: "", logoUrl: "", generation: "", platformType: "" });
      setIgdbPreview(null);
      setIgdbInput("");
    } catch (err) {
      setFormError(err.response?.data?.error || "Erro ao salvar plataforma.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(platform) {
    if (!confirm(`Deletar "${platform.name}"?`)) return;
    try {
      await api.delete(`/platforms/${platform.id}`);
      setPlatforms((prev) => prev.filter((p) => p.id !== platform.id));
    } catch {
      setError("Erro ao deletar plataforma.");
    }
  }

  const filtered = platforms.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/admin" style={styles.back}>← Painel</Link>
        <h1 style={styles.title}>Plataformas</h1>
      </div>

      {/* Importação IGDB */}
      {!editing && (
        <div style={styles.igdbBlock}>
          <h3 style={styles.igdbTitle}>🎮 Importar do IGDB</h3>
          <p style={styles.igdbHint}>
            Cole a URL ou ID numérico da plataforma no IGDB para preencher automaticamente.
            Ex: <em>https://www.igdb.com/platforms/super-nintendo-entertainment-system</em> ou <em>58</em>
          </p>
          <div style={styles.igdbRow}>
            <input
              style={styles.igdbInput}
              type="text"
              value={igdbInput}
              onChange={(e) => setIgdbInput(e.target.value)}
              placeholder="URL ou ID do IGDB..."
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
              <div style={styles.igdbPreviewRow}>
                {igdbPreview.logoUrl && (
                  <img
                    src={igdbPreview.logoUrl}
                    alt={igdbPreview.name}
                    style={styles.igdbLogo}
                  />
                )}
                <div>
                  <p style={styles.igdbPreviewName}>{igdbPreview.name}</p>
                  {igdbPreview.generation && (
                    <p style={styles.igdbPreviewDetail}>
                      Geração {igdbPreview.generation}
                    </p>
                  )}
                  {igdbPreview.platformType && (
                    <p style={styles.igdbPreviewDetail}>
                      {PLATFORM_TYPE_LABELS[igdbPreview.platformType] || igdbPreview.platformType}
                    </p>
                  )}
                </div>
              </div>
              <p style={styles.igdbPreviewHint}>
                ✅ Dados preenchidos abaixo. Revise e salve.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Formulário */}
      <div style={styles.formBlock}>
        <h3 style={styles.formTitle}>
          {editing ? `Editando: ${editing.name}` : "Nova plataforma"}
        </h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Nome *</label>
            <input
              style={styles.input}
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Super Nintendo"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>URL do Logo</label>
            <input
              style={styles.input}
              type="text"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              placeholder="https://..."
            />
            {form.logoUrl && (
              <img
                src={form.logoUrl}
                alt="preview"
                style={styles.logoPreview}
              />
            )}
          </div>

          <div style={styles.row2col}>
            <div style={styles.field}>
              <label style={styles.label}>Geração</label>
              <input
                style={styles.input}
                type="number"
                value={form.generation}
                onChange={(e) =>
                  setForm({ ...form, generation: e.target.value })
                }
                placeholder="Ex: 4"
                min="1"
                max="20"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Tipo</label>
              <select
                style={styles.select}
                value={form.platformType}
                onChange={(e) =>
                  setForm({ ...form, platformType: e.target.value })
                }
              >
                <option value="">Selecione...</option>
                {Object.entries(PLATFORM_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formError && <p style={styles.error}>{formError}</p>}

          <div style={styles.formActions}>
            {editing && (
              <button
                type="button"
                style={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancelar
              </button>
            )}
            {!editing && (form.name || igdbPreview) && (
              <button
                type="button"
                style={styles.cancelButton}
                onClick={handleCancel}
              >
                Limpar
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
                : "Adicionar plataforma"}
            </button>
          </div>
        </form>
      </div>

      {/* Lista */}
      <input
        style={styles.search}
        type="text"
        placeholder="Filtrar plataformas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p style={styles.errorMsg}>{error}</p>}

      {loading ? (
        <p style={styles.message}>Carregando...</p>
      ) : filtered.length === 0 ? (
        <p style={styles.message}>Nenhuma plataforma encontrada.</p>
      ) : (
        <div style={styles.list}>
          <div style={styles.listHeader}>
            <span>Plataforma</span>
            <span>Geração</span>
            <span>Tipo</span>
            <span>Ações</span>
          </div>
          {filtered.map((platform) => (
            <div key={platform.id} style={styles.listRow}>
              <div style={styles.platformName}>
                {platform.logoUrl && (
                  <img
                    src={platform.logoUrl}
                    alt={platform.name}
                    style={styles.platformLogo}
                  />
                )}
                <span>{platform.name}</span>
              </div>
              <span style={styles.cell}>
                {platform.generation ? `${platform.generation}ª` : "—"}
              </span>
              <span style={styles.cell}>
                {PLATFORM_TYPE_LABELS[platform.platformType] || "—"}
              </span>
              <div style={styles.actions}>
                <button
                  style={styles.editButton}
                  onClick={() => handleEdit(platform)}
                >
                  Editar
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(platform)}
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
    maxWidth: "900px",
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
  igdbBlock: {
    backgroundColor: "#1a1a2e",
    border: "1px solid #e9456044",
    borderRadius: "10px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
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
    lineHeight: "1.6",
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
  igdbPreviewRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "0.5rem",
  },
  igdbLogo: {
    height: "40px",
    objectFit: "contain",
  },
  igdbPreviewName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1rem",
    marginBottom: "0.25rem",
  },
  igdbPreviewDetail: {
    color: "#a8a8b3",
    fontSize: "0.85rem",
  },
  igdbPreviewHint: {
    color: "#a8a8b3",
    fontSize: "0.8rem",
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
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    flex: 1,
  },
  row2col: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  label: {
    color: "#a8a8b3",
    fontSize: "0.85rem",
  },
  input: {
    backgroundColor: "#16213e",
    border: "1px solid #e9456044",
    borderRadius: "6px",
    padding: "0.75rem 1rem",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
  },
  select: {
    backgroundColor: "#16213e",
    border: "1px solid #e9456044",
    borderRadius: "6px",
    padding: "0.75rem 1rem",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
  },
  logoPreview: {
    height: "40px",
    objectFit: "contain",
    marginTop: "0.5rem",
  },
  error: {
    color: "#e94560",
    fontSize: "0.85rem",
    backgroundColor: "#e9456022",
    padding: "0.5rem 0.75rem",
    borderRadius: "4px",
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
  errorMsg: {
    color: "#e94560",
    marginBottom: "1rem",
  },
  list: {
    border: "1px solid #e9456022",
    borderRadius: "8px",
    overflow: "hidden",
  },
  listHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 100px 160px 180px",
    padding: "0.75rem 1rem",
    backgroundColor: "#1a1a2e",
    color: "#a8a8b3",
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  listRow: {
    display: "grid",
    gridTemplateColumns: "1fr 100px 160px 180px",
    padding: "0.85rem 1rem",
    borderTop: "1px solid #e9456011",
    alignItems: "center",
  },
  platformName: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    color: "#fff",
    fontSize: "0.95rem",
  },
  platformLogo: {
    height: "24px",
    objectFit: "contain",
  },
  cell: {
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
  message: {
    color: "#a8a8b3",
    padding: "2rem",
    textAlign: "center",
  },
};

export default AdminPlatformsPage;