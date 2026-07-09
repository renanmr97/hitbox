import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/games?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        🎮 Hitbox
      </Link>

      {/* Campo de busca */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          style={styles.searchInput}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar jogos..."
        />
        <button type="submit" style={styles.searchButton}>
          🔍
        </button>
      </form>

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
    gap: "1rem",
    flexWrap: "wrap",
  },
  logo: {
    color: "#e94560",
    textDecoration: "none",
    fontSize: "1.5rem",
    fontWeight: "bold",
    flexShrink: 0,
  },
  searchForm: {
    display: "flex",
    flex: 1,
    maxWidth: "400px",
    gap: "0",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#16213e",
    border: "1px solid #e9456044",
    borderRight: "none",
    borderRadius: "6px 0 0 6px",
    padding: "0.5rem 1rem",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
  },
  searchButton: {
    backgroundColor: "#e94560",
    border: "none",
    borderRadius: "0 6px 6px 0",
    padding: "0.5rem 0.9rem",
    cursor: "pointer",
    fontSize: "1rem",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    flexShrink: 0,
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