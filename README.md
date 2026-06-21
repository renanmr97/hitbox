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
hitbox/

├── backend/

│   ├── prisma/

│   │   ├── schema.prisma     # Modelo de dados

│   │   └── migrations/       # Histórico de mudanças no banco

│   ├── src/

│   │   ├── controllers/      # Lógica de cada rota

│   │   ├── routes/           # Definição das URLs da API

│   │   ├── lib/              # Conexão com o banco (Prisma Client)

│   │   └── server.js         # Ponto de entrada da aplicação

│   ├── .env                  # Variáveis de ambiente (não versionado)

│   └── package.json

├── frontend/   # Site (React) — ainda não iniciado

├── docs/       # Documentação técnica, diagramas e decisões do projeto

└── README.md

## 🚀 Como rodar o projeto localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (LTS recomendado)
- [PostgreSQL](https://www.postgresql.org/) rodando localmente
- [Git](https://git-scm.com/)

### Backend (API)

1. Clone o repositório e entre na pasta do backend:
```bash
   git clone https://github.com/renanmr97/hitbox.git
   cd hitbox/backend
```

2. Instale as dependências:
```bash
   npm install
```

3. Crie um banco de dados PostgreSQL chamado `hitbox` (pode usar o pgAdmin ou a linha de comando).

4. Crie um arquivo `.env` na pasta `backend/` com o seguinte conteúdo, substituindo pela sua senha do PostgreSQL:
```env
   DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/hitbox?schema=public"
```
   > ⚠️ Se sua senha tiver caracteres especiais (`@`, `#`, `%`, etc.), eles precisam ser codificados (percent-encoded). Exemplo: `@` vira `%40`. Você pode gerar a senha codificada rodando `node -e "console.log(encodeURIComponent('SUA_SENHA'))"`.

5. Aplique as migrations (cria as tabelas no banco):
```bash
   npx prisma migrate dev
```

6. Gere o Prisma Client:
```bash
   npx prisma generate
```
   > **Importante:** este passo é obrigatório sempre que o projeto é clonado pela primeira vez, ou sempre que o `schema.prisma` for alterado. O Prisma Client é código gerado automaticamente e não fica versionado no Git.

7. Inicie o servidor em modo desenvolvimento (reinício automático a cada alteração):
```bash
   npm run dev
```

   O servidor deve subir em `http://localhost:3000`.

### Frontend

> Ainda não implementado. Instruções serão adicionadas quando o frontend for iniciado.

## ⚠️ Nota técnica: geração do Prisma Client

Este projeto usa o gerador **`prisma-client-js`** (e não o novo gerador `prisma-client`, introduzido no Prisma 7) por uma razão específica: na versão atual do Prisma 7, o gerador `prisma-client` força a saída em sintaxe TypeScript/ESM mesmo quando configurado para gerar arquivos `.js` (comportamento documentado e confirmado pela própria equipe do Prisma como não suportado — `generatedFileExtension = "js"` não produz JavaScript puro). Isso quebra a importação via `require()` em um projeto CommonJS puro como este.

O gerador `prisma-client-js` é a opção estável e testada que gera um client 100% compatível com CommonJS, sem necessidade de configurações extras. Caso o projeto migre para TypeScript ou ES Modules no futuro, vale reavaliar o gerador novo.

## 📄 Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](./LICENSE) para mais detalhes.