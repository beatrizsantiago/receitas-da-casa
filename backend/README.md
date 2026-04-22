# Backend - Receitas da Casa

API REST desenvolvida com **NestJS**, **Prisma** e **PostgreSQL**.

## Requisitos

- Node.js 20+
- PostgreSQL 14+
- npm

## Configuração inicial

### 1. Variáveis de ambiente

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
FRONTEND_URL="http://localhost:5173"
PORT=3000

JWT_SECRET="sua-chave-secreta-jwt"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="sua-chave-secreta-refresh"
JWT_REFRESH_EXPIRES_IN="7d"

AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET=""
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar o banco de dados

Execute as migrations e gere o Prisma Client:

```bash
npx prisma migrate dev
npx prisma generate
```

## Executar o projeto

### Modo desenvolvimento (com hot reload)

```bash
npm run start:dev
```

A API estará disponível em: `http://localhost:3000`

Documentação Swagger: `http://localhost:3000/api/docs`

### Build para produção

```bash
npm run build
npm run start:prod
```

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | Desenvolvimento com hot reload |
| `npm run start:debug` | Debug com watch mode |
| `npm run start:prod` | Produção (requer build) |
| `npm run build` | Compila o projeto |
| `npm run format` | Formata o código com Prettier |
| `npm run lint` | Executa o ESLint |

## Estrutura da API

- **Prefixo global:** `/api`
- **Autenticação:** JWT Bearer Token
- **Rotas públicas:** `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`
- **Documentação:** Swagger UI em `/api/docs`

## Tecnologias

- NestJS 11
- Prisma 7 (ORM)
- PostgreSQL
- Passport + JWT
- AWS S3 SDK (upload de fotos)
- Swagger/OpenAPI
- bcrypt (hash de senhas)
