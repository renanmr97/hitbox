require("dotenv").config();
const express = require("express");
const cors = require("cors");

const gamesRoutes = require("./routes/gamesRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota de teste raiz
app.get("/", (req, res) => {
  res.json({ message: "API do Hitbox no ar 🎮" });
});

// Rotas da aplicação
app.use("/games", gamesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});