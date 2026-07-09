import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        🎮 Hitbox
      </Link>

      <div style={styles.links}>
        <Link to="/games" style={styles.link}>Jogos</Link>

        {user ? (
          <>
            <Link to="/profile" style={styles.link}>
              👤 {user.username}
            </Link>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Entrar</Link>
            <Link to="/register" style={styles.linkButton}>Cadastrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    backgroundColor: "#1a1a2e",
    color: "#fff",
  },
  logo: {
    color: "#e94560",
    textDecoration: "none",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
  },
  linkButton: {
    color: "#e94560",
    textDecoration: "none",
    fontSize: "1rem",
    border: "1px solid #e94560",
    padding: "0.35rem 0.9rem",
    borderRadius: "6px",
  },
  username: {
    color: "#a8a8b3",
    fontSize: "0.9rem",
  },
  logoutButton: {
    background: "none",
    border: "1px solid #e9456066",
    color: "#e94560",
    padding: "0.35rem 0.9rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
};

export default Navbar;