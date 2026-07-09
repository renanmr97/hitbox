import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error || "Erro ao fazer login. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Entrar</h1>
        <p style={styles.subtitle}>
          Não tem conta?{" "}
          <Link to="/register" style={styles.link}>
            Cadastre-se
          </Link>
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>E-mail</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            style={loading ? styles.buttonDisabled : styles.button}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "90vh",
    backgroundColor: "#16213e",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#1a1a2e",
    padding: "2.5rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "420px",
    border: "1px solid #e9456033",
  },
  title: {
    color: "#e94560",
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#a8a8b3",
    fontSize: "0.9rem",
    marginBottom: "2rem",
  },
  link: {
    color: "#e94560",
    textDecoration: "none",
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
    backgroundColor: "#16213e",
    border: "1px solid #e9456044",
    borderRadius: "6px",
    padding: "0.75rem 1rem",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.85rem",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "0.5rem",
  },
  buttonDisabled: {
    backgroundColor: "#e9456088",
    color: "#fff",
    border: "none",
    padding: "0.85rem",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "not-allowed",
    fontWeight: "bold",
    marginTop: "0.5rem",
  },
};

export default LoginPage;