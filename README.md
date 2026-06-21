# 🎮 Hitbox

Hitbox é um banco de dados de jogos de vídeo game — inspirado no [IGDB](https://www.igdb.com/) — onde usuários podem pesquisar jogos, criar listas (públicas ou privadas) do que querem jogar, estão jogando ou já jogaram, avaliar jogos com notas e seguir outros usuários para ver suas listas.

Este projeto também tem como objetivo ser um espaço de aprendizado prático de desenvolvimento full-stack, boas práticas de mercado, versionamento, documentação e QA.

> 🚧 **Status:** em desenvolvimento inicial (fase de estruturação do projeto).

## ✨ Funcionalidades planejadas

- Página inicial com busca global, carrossel de lançamentos, lançamentos mais aguardados e avaliações recentes
- Cadastro/login de usuários (comum e administrador)
- Listas de jogos públicas/privadas com status (quero jogar, jogando, joguei)
- Avaliações de jogos com notas
- Seguir outros usuários e ver suas listas
- Painel administrativo (gestão de jogos, usuários e avaliações)
- Suporte a múltiplos idiomas (PT, EN, ES) e tema claro/escuro
- API REST aberta e documentada

## 🛠️ Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite (JavaScript) |
| Backend / API | Node.js + Express |
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Testes | Jest / Supertest |
| Documentação da API | Swagger (OpenAPI) |
| Versionamento | Git + GitHub |

## 📁 Estrutura do projeto

```
hitbox/
├── backend/    # API REST (Node/Express) + Prisma + banco de dados
├── frontend/   # Site (React)
├── docs/       # Documentação técnica, diagramas e decisões do projeto
└── README.md
```

## 🚀 Como rodar o projeto localmente

> Instruções detalhadas serão adicionadas conforme o backend e o frontend forem implementados.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (LTS)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

## 📄 Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](./LICENSE) para mais detalhes.