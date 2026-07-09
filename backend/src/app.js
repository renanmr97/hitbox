require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./lib/swagger");

const authRoutes = require("./routes/authRoutes");
const gamesRoutes = require("./routes/gamesRoutes");
const platformsRoutes = require("./routes/platformsRoutes");
const franchisesRoutes = require("./routes/franchisesRoutes");
const listRoutes = require("./routes/listRoutes");
const usersRoutes = require("./routes/usersRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");
const igdbRoutes = require("./routes/igdbRoutes");

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota de teste raiz
app.get("/", (req, res) => {
  res.json({ message: "API do Hitbox no ar 🎮" });
});

// Rotas da aplicação
app.use("/games", gamesRoutes);
app.use("/platforms", platformsRoutes);
app.use("/franchises", franchisesRoutes);
app.use("/list", listRoutes);
app.use("/users", usersRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/igdb", igdbRoutes);


module.exports = app;