import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const STATUS_LABELS = {
  WANT_TO_PLAY: "Quero jogar",
  PLAYING: "Jogando",
  PLAYED: "Joguei",
};

function ListButton({ gameId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    api.get(`/list/${gameId}`)
      .then((res) => setCurrentStatus(res.data.status))
      .catch(() => setCurrentStatus(null))
      .finally(() => setLoading(false));
  }, [gameId, user]);

  async function handleSelect(status) {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (currentStatus === status) {
        // Clicou no status atual → remove da lista
        await api.delete(`/list/${gameId}`);
        setCurrentStatus(null);
      } else {
        // Adiciona ou muda o status
        await api.post("/list", { gameId, status });
        setCurrentStatus(status);
      }
    } catch (error) {
      console.error("Erro ao atualizar lista:", error);
    }
  }

  if (loading) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.label}>Minha lista</h3>
      <div style={styles.buttons}>
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <button
            key={status}
            onClick={() => handleSelect(status)}
            style={
              currentStatus === status
                ? styles.buttonActive
                : styles.button
            }
          >
            {currentStatus === status ? "✓ " : ""}{label}
          </button>
        ))}
      </div>
      {!user && (
        <p style={styles.hint}>
          <span
            style={styles.hintLink}
            onClick={() => navigate("/login")}
          >
            Entre
          </span>{" "}
          para adicionar à sua lista
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginBottom: "1.5rem",
  },
  label: {
    fontSize: "0.8rem",
    color: "#a8a8b3",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "0.75rem",
  },
  buttons: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "#16213e",
    border: "1px solid #e9456044",
    color: "#a8a8b3",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.15s",
  },
  buttonActive: {
    backgroundColor: "#e94560",
    border: "1px solid #e94560",
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
  hint: {
    color: "#a8a8b3",
    fontSize: "0.85rem",
    marginTop: "0.75rem",
  },
  hintLink: {
    color: "#e94560",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default ListButton;