# Receitas da Casa

Monorepo de uma aplicação web para gerenciamento pessoal de receitas culinárias.

---

## Visao Geral

**Receitas da Casa** permite que usuarios cadastrem, organizem e acompanhem suas proprias receitas. A aplicacao possui autenticacao JWT, CRUD completo de receitas com ingredientes, passos, anotacoes, tags, fotos (AWS S3) e historico de cozinhadas.

---

## Estrutura do Monorepo

```
receitas-da-casa/
├── backend/          # API REST (NestJS + Prisma + PostgreSQL)
├── frontend/         # Aplicacao web (React + Vite + Chakra UI)
├── package.json      # Scripts de orquestracao
└── README.md         # Este arquivo
```

| Pasta | Tecnologias | Porta padrao |
|-------|-------------|--------------|
| `backend/` | NestJS, Prisma, PostgreSQL, Passport/JWT | 3000 |
| `frontend/` | React 19, Vite, TypeScript, Chakra UI v3 | 5173 |

---

## Requisitos

- Node.js 20+
- PostgreSQL 14+
- npm

---

## Configuracao Inicial

### 1. Clonar e instalar dependencias

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

Ou, se preferir, instale diretamente em cada pasta:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configurar variaveis de ambiente

#### Backend

```bash
cp backend/.env.example backend/.env
```

Edite `backend/.env` com suas credenciais do PostgreSQL e chaves JWT:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/receitasdacasa?schema=public"
FRONTEND_URL="http://localhost:5173"
PORT=3000

JWT_SECRET="sua-chave-secreta-jwt"
JWT_REFRESH_SECRET="sua-chave-secreta-refresh"
```

#### Frontend

```bash
cp frontend/.env.example frontend/.env
```

Conteudo de `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Preparar o banco de dados

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

---

## Executar o projeto

### Opcao 1: Rodar tudo de uma vez (raiz)

```bash
npm run dev
```

Este comando inicia o **backend** e o **frontend** simultaneamente.

- API: `http://localhost:3000`
- App: `http://localhost:5173`
- Docs: `http://localhost:3000/api/docs`

### Opcao 2: Rodar separadamente

**Terminal 1 - Backend:**

```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

---

## Scripts disponiveis (raiz)

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Inicia backend e frontend em paralelo |
| `npm run dev:backend` | Inicia apenas o backend |
| `npm run dev:frontend` | Inicia apenas o frontend |
| `npm run build` | Build de producao (backend + frontend) |
| `npm run build:backend` | Build do backend |
| `npm run build:frontend` | Build do frontend |

---

## Documentacao detalhada

- [**Backend**](backend/README.md) - Configuracao da API, migrations, autenticacao, endpoints
- [**Frontend**](frontend/README.md) - Rotas, arquitetura feature-based, autenticacao, build

---

## Tecnologias Principais

### Backend
- NestJS 11
- Prisma 7 (ORM)
- PostgreSQL
- Passport + JWT (access + refresh tokens)
- AWS S3 SDK (upload de fotos)
- Swagger / OpenAPI

### Frontend
- React 19
- React Router 7
- Vite 8
- TypeScript 6
- Chakra UI v3
- Axios (com interceptores de token e refresh automatico)

---

## Fluxo de Autenticacao

1. Usuario se cadastra ou faz login em `/`
2. Backend retorna `accessToken`, `refreshToken` e dados do usuario
3. Tokens sao armazenados no `localStorage`
4. Axios intercepta todas as requisicoes e injeta o Bearer token
5. Em caso de 401, o refresh token e usado automaticamente para renovar o access token
6. Se o refresh falhar, o usuario e redirecionado para a tela de login

---

## Funcionalidades

- Cadastro e login de usuarios
- Criacao de receitas (titulo, descricao, categoria)
- Gerenciamento de ingredientes (CRUD inline)
- Passos de preparo ordenados (CRUD inline)
- Anotacoes com prioridade (CRUD inline)
- Tags coloridas (CRUD inline)
- Upload de fotos via URL pre-assinada do S3
- Historico de cozinhadas com avaliacao
- Soft delete de receitas
- Filtro por categoria (Doce / Salgado)
