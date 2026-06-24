const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hitbox API",
      version: "1.0.0",
      description:
        "API do Hitbox — banco de dados de jogos de vídeo game. Permite gerenciar jogos, plataformas, franquias, usuários, listas e avaliações.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local de desenvolvimento",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;