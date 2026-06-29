const request = require("supertest");
const app = require("../app");
const prisma = require("../lib/prisma");

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: { contains: "teste_auth" } },
  });
  await prisma.$disconnect();
});

describe("POST /auth/register", () => {
  it("deve cadastrar um novo usuário e retornar 201", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "usuario_teste_auth",
      email: "teste_auth@exemplo.com",
      password: "senha123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).not.toHaveProperty("passwordHash");
    expect(res.body.role).toBe("USER");
  });

  it("deve retornar 409 para email já cadastrado", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "outro_usuario",
      email: "teste_auth@exemplo.com",
      password: "senha123",
    });
    expect(res.statusCode).toBe(409);
  });

  it("deve retornar 400 se campos obrigatórios estiverem ausentes", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "teste_auth2@exemplo.com",
    });
    expect(res.statusCode).toBe(400);
  });

  it("deve retornar 400 se a senha tiver menos de 6 caracteres", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "usuario_teste_auth2",
      email: "teste_auth2@exemplo.com",
      password: "123",
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /auth/login", () => {
  it("deve fazer login e retornar token JWT", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "teste_auth@exemplo.com",
      password: "senha123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).not.toHaveProperty("passwordHash");
  });

  it("deve retornar 401 para senha incorreta", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "teste_auth@exemplo.com",
      password: "senhaerrada",
    });
    expect(res.statusCode).toBe(401);
  });

  it("deve retornar 401 para email não cadastrado", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "naoexiste@exemplo.com",
      password: "senha123",
    });
    expect(res.statusCode).toBe(401);
  });

  it("deve retornar 400 se campos obrigatórios estiverem ausentes", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "teste_auth@exemplo.com",
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("Rotas protegidas", () => {
  let userToken;
  let adminToken;

  beforeAll(async () => {
    // Login do usuário comum
    const userRes = await request(app).post("/auth/login").send({
      email: "teste_auth@exemplo.com",
      password: "senha123",
    });
    userToken = userRes.body.token;

    // Promove o usuário para ADMIN diretamente no banco
    await prisma.user.update({
      where: { email: "teste_auth@exemplo.com" },
      data: { role: "ADMIN" },
    });

    // Login novamente para pegar token com role ADMIN
    const adminRes = await request(app).post("/auth/login").send({
      email: "teste_auth@exemplo.com",
      password: "senha123",
    });
    adminToken = adminRes.body.token;
  });

  it("deve retornar 401 ao tentar criar jogo sem token", async () => {
    const res = await request(app).post("/games").send({
      title: "[TESTE] Jogo sem token",
    });
    expect(res.statusCode).toBe(401);
  });

  it("deve retornar 403 ao tentar criar jogo com token USER", async () => {
    const res = await request(app)
      .post("/games")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "[TESTE] Jogo USER" });
    expect(res.statusCode).toBe(403);
  });

  it("deve criar jogo com token ADMIN e retornar 201", async () => {
    const res = await request(app)
      .post("/games")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "[TESTE] Jogo ADMIN" });
    expect(res.statusCode).toBe(201);
  });
});