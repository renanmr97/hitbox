function HomePage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bem-vindo ao Hitbox</h1>
      <p style={styles.subtitle}>
        Seu banco de dados de jogos de vídeo game.
      </p>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    backgroundColor: "#16213e",
    color: "#fff",
  },
  title: {
    fontSize: "3rem",
    color: "#e94560",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#a8a8b3",
  },
};

export default HomePage;