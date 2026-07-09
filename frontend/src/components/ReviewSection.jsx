import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function StarRating({ value, onChange, readonly }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={styles.stars}>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(null)}
          style={{
            ...styles.star,
            color:
              star <= (hovered ?? value)
                ? "#e94560"
                : "#333",
            cursor: readonly ? "default" : "pointer",
          }}
        >
          ★
        </button>
      ))}
      {value > 0 && (
        <span style={styles.ratingValue}>{value}/10</span>
      )}
    </div>
  );
}

function ReviewSection({ gameId }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [form, setForm] = useState({ rating: 0, comment: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [gameId]);

  async function fetchReviews() {
    try {
      const res = await api.get(`/reviews/game/${gameId}`);
      setReviews(res.data);

      if (user) {
        const mine = res.data.find((r) => r.user.id === user.id);
        if (mine) {
          setMyReview(mine);
          setForm({ rating: mine.rating, comment: mine.comment || "" });
        }
      }
    } catch {
      // sem avaliações ainda, tudo bem
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.rating === 0) {
      setError("Selecione uma nota antes de enviar.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.post("/reviews", { gameId, ...form });
      await fetchReviews();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao salvar avaliação.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Remover sua avaliação?")) return;

    try {
      await api.delete(`/reviews/${gameId}`);
      setMyReview(null);
      setForm({ rating: 0, comment: "" });
      setShowForm(false);
      await fetchReviews();
    } catch {
      setError("Erro ao remover avaliação.");
    }
  }

  const average =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const otherReviews = reviews.filter((r) => r.user.id !== user?.id);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          Avaliações
          {average && (
            <span style={styles.average}> ⭐ {average}/10</span>
          )}
          <span style={styles.count}>({reviews.length})</span>
        </h3>

        {user && !showForm && (
          <button
            style={styles.writeButton}
            onClick={() => setShowForm(true)}
          >
            {myReview ? "Editar avaliação" : "Avaliar"}
          </button>
        )}

        {!user && (
          <button
            style={styles.writeButton}
            onClick={() => navigate("/login")}
          >
            Entre para avaliar
          </button>
        )}
      </div>

      {/* Minha avaliação atual (quando não está editando) */}
      {myReview && !showForm && (
        <div style={styles.myReview}>
          <div style={styles.reviewHeader}>
            <span style={styles.reviewUser}>Você</span>
            <StarRating value={myReview.rating} readonly />
          </div>
          {myReview.comment && (
            <p style={styles.reviewComment}>{myReview.comment}</p>
          )}
          <button style={styles.deleteButton} onClick={handleDelete}>
            Remover avaliação
          </button>
        </div>
      )}

      {/* Formulário de avaliação */}
      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formField}>
            <label style={styles.label}>Nota</label>
            <StarRating
              value={form.rating}
              onChange={(v) => setForm({ ...form, rating: v })}
            />
          </div>

          <div style={styles.formField}>
            <label style={styles.label}>Comentário (opcional)</label>
            <textarea
              style={styles.textarea}
              value={form.comment}
              onChange={(e) =>
                setForm({ ...form, comment: e.target.value })
              }
              placeholder="O que achou desse jogo?"
              rows={3}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.formActions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => {
                setShowForm(false);
                setError(null);
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={submitting ? styles.submitDisabled : styles.submitButton}
              disabled={submitting}
            >
              {submitting ? "Salvando..." : "Salvar avaliação"}
            </button>
          </div>
        </form>
      )}

      {/* Avaliações de outros usuários */}
      {!loading && otherReviews.length > 0 && (
        <div style={styles.reviewsList}>
          {otherReviews.map((review) => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <span style={styles.reviewUser}>{review.user.username}</span>
                <StarRating value={review.rating} readonly />
              </div>
              {review.comment && (
                <p style={styles.reviewComment}>{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <p style={styles.empty}>Nenhuma avaliação ainda. Seja o primeiro!</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "2rem",
    borderTop: "1px solid #e9456022",
    paddingTop: "2rem",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  title: {
    fontSize: "1.1rem",
    color: "#fff",
    fontWeight: "bold",
  },
  average: {
    color: "#e94560",
    marginLeft: "0.5rem",
  },
  count: {
    color: "#a8a8b3",
    fontSize: "0.9rem",
    fontWeight: "normal",
    marginLeft: "0.25rem",
  },
  writeButton: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  myReview: {
    backgroundColor: "#1a1a2e",
    border: "1px solid #e94560",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1.5rem",
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  reviewCard: {
    backgroundColor: "#1a1a2e",
    border: "1px solid #e9456022",
    borderRadius: "8px",
    padding: "1rem",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  reviewUser: {
    color: "#e94560",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  reviewComment: {
    color: "#ccc",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    marginTop: "0.25rem",
  },
  deleteButton: {
    background: "none",
    border: "none",
    color: "#a8a8b3",
    fontSize: "0.8rem",
    cursor: "pointer",
    padding: "0",
    marginTop: "0.75rem",
    textDecoration: "underline",
  },
  form: {
    backgroundColor: "#1a1a2e",
    border: "1px solid #e9456033",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    color: "#a8a8b3",
    fontSize: "0.85rem",
  },
  stars: {
    display: "flex",
    alignItems: "center",
    gap: "0.1rem",
  },
  star: {
    background: "none",
    border: "none",
    fontSize: "1.8rem",
    padding: "0",
    lineHeight: "1",
    transition: "color 0.1s",
  },
  ratingValue: {
    color: "#e94560",
    fontWeight: "bold",
    marginLeft: "0.5rem",
    fontSize: "0.9rem",
  },
  textarea: {
    backgroundColor: "#16213e",
    border: "1px solid #e9456044",
    borderRadius: "6px",
    padding: "0.75rem",
    color: "#fff",
    fontSize: "0.95rem",
    resize: "vertical",
    fontFamily: "inherit",
    outline: "none",
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
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  submitButton: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1.25rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
  submitDisabled: {
    backgroundColor: "#e9456088",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1.25rem",
    borderRadius: "6px",
    cursor: "not-allowed",
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
  empty: {
    color: "#a8a8b3",
    fontSize: "0.9rem",
    fontStyle: "italic",
  },
};

export default ReviewSection;