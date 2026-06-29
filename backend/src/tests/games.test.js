const request = require("supertest");
const app = require("../app");
const prisma = require("../lib/prisma");

let adminToken;

// Antes de todos os testes: cria um usuário admin e faz login
beforeAll(async () => {
  await prisma.user.deleteMany({
    where: { email: "admin_games_test@exemplo.com" },
  });

  await request(app).post("/auth/register").send({
    username: "admin_games_test",
    email: "admin_games_test@exemplo.com",
    password: "senha123",
  });

  await prisma.user.update({
    where: { email: "admin_games_test@exemplo.com" },
    data: { role: "ADMIN" },
  });

  const loginRes = await request(app).post("/auth/login").send({
    email: "admin_games_test@exemplo.com",
    password: "senha123",
  });

  adminToken = loginRes.body.token;
});

// Após todos os testes: limpa dados criados
afterAll(async () => {
  await prisma.game.deleteMany({
    where: { title: { startsWith: "[TESTE]" } },
  });
  await prisma.user.deleteMany({
    where: { email: "admin_games_test@exemplo.com" },
  });
  await prisma.$disconnect();
});

describe("GET /games", () => {
  it("deve retornar status 200 e um array", async () => {
    const res = await request(app).get("/games");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("POST /games", () => {
  it("deve criar um jogo e retornar status 201", async () => {
    const res = await request(app)
      .post("/games")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "[TESTE] Jogo de Teste",
        synopsis: "Criado automaticamente pelo teste.",
        initialReleaseDate: "2000-01-01",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("[TESTE] Jogo de Teste");
  });

  it("deve retornar 400 se o titulo estiver ausente", async () => {
    const res = await request(app)
      .post("/games")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ synopsis: "Sem título" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve retornar 401 sem token", async () => {
    const res = await request(app)
      .post("/games")
      .send({ title: "[TESTE] Sem token" });
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /games/:id", () => {
  let gameId;

  beforeAll(async () => {
    const res = await request(app)
      .post("/games")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "[TESTE] Jogo para busca por ID" });
    gameId = res.body.id;
  });

  it("deve retornar o jogo com status 200", async () => {
    const res = await request(app).get(`/games/${gameId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(gameId);
  });

  it("deve retornar 404 para um ID inexistente", async () => {
    const res = await request(app).get(
      "/games/00000000-0000-0000-0000-000000000000"
    );
    expect(res.statusCode).toBe(404);
  });
});

describe("PUT /games/:id", () => {
  let gameId;

  beforeAll(async () => {
    const res = await request(app)
      .post("/games")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "[TESTE] Jogo para atualizar" });
    gameId = res.body.id;
  });

  it("deve atualizar o jogo e retornar status 200", async () => {
    const res = await request(app)
      .put(`/games/${gameId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "[TESTE] Jogo atualizado" });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("[TESTE] Jogo atualizado");
  });

  it("deve retornar 404 para um ID inexistente", async () => {
    const res = await request(app)
      .put("/games/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "[TESTE] Não existe" });
    expect(res.statusCode).toBe(404);
  });

  it("deve retornar 401 sem token", async () => {
    const res = await request(app)
      .put(`/games/${gameId}`)
      .send({ title: "[TESTE] Sem token" });
    expect(res.statusCode).toBe(401);
  });
});

describe("DELETE /games/:id", () => {
  let gameId;

  beforeAll(async () => {
    const res = await request(app)
      .post("/games")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "[TESTE] Jogo para deletar" });
    gameId = res.body.id;
  });

  it("deve deletar o jogo e retornar status 204", async () => {
    const res = await request(app)
      .delete(`/games/${gameId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(204);
  });

  it("deve retornar 404 ao buscar o jogo deletado", async () => {
    const res = await request(app).get(`/games/${gameId}`);
    expect(res.statusCode).toBe(404);
  });

  it("deve retornar 401 sem token", async () => {
    const res = await request(app).delete(`/games/${gameId}`);
    expect(res.statusCode).toBe(401);
  });
});