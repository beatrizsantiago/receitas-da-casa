# Deploy — CI/CD com GitHub Actions + GHCR + CapRover

Pipeline: a cada push na branch `main`, o GitHub Actions **builda** as imagens
de backend e frontend, **publica** no GitHub Container Registry (GHCR) e
**dispara o deploy** para os respectivos apps no CapRover.

```
push main ──▶ GitHub Actions ──▶ build Docker ──▶ push GHCR ──▶ deploy CapRover
```

Arquivos relevantes:

- `backend/Dockerfile` — NestJS + Prisma (multi-stage, roda `prisma migrate deploy` ao subir)
- `frontend/Dockerfile` — Vite build servido por nginx (SPA)
- `frontend/nginx.conf` — fallback de rotas do SPA + cache de assets
- `.github/workflows/deploy.yml` — esteira

---

## 1. Criar os apps no CapRover

No painel do CapRover, crie **dois apps**, por exemplo:

- `receitas-backend`
- `receitas-frontend`

### Portas (Container HTTP Port)

Em cada app → aba **HTTP Settings** → **Container HTTP Port**:

| App                | Porta |
| ------------------ | ----- |
| receitas-backend   | 3000  |
| receitas-frontend  | 80    |

Habilite HTTPS e force HTTPS quando o domínio estiver pronto.

### Banco de dados

Crie um app de **PostgreSQL** (One-Click App do CapRover) ou aponte para um
Postgres gerenciado. Guarde a connection string para a variável `DATABASE_URL`.

### Variáveis de ambiente do backend

No app `receitas-backend` → **App Configs** → **Environment Variables**
(baseado em `backend/.env.example`):

```
DATABASE_URL=postgresql://USER:PASSWORD@srv-captain--postgres:5432/receitas?schema=public
FRONTEND_URL=https://receitas.seudominio.com
PORT=3000
JWT_SECRET=...
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=...
JWT_REFRESH_EXPIRES_IN=7d
AWS_REGION=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
```

> O frontend **não** recebe env em runtime: o `VITE_API_URL` é embutido no
> bundle durante o build (veja a variável `VITE_API_URL` na seção 3).

---

## 2. Permitir que o CapRover puxe imagens do GHCR

O CapRover faz `docker pull` da imagem publicada no GHCR. Escolha uma opção:

- **Opção A (mais simples):** tornar os _packages_ do GHCR **públicos** —
  em `github.com/beatrizsantiago?tab=packages`, abra cada package
  (`receitas-da-casa-backend` / `-frontend`) → **Package settings** →
  **Change visibility → Public**.

- **Opção B (privado):** no CapRover → **Cluster** → **Docker Registries** →
  **Add Remote Registry**:
  - Registry: `ghcr.io`
  - Username: seu usuário do GitHub
  - Password: um **Personal Access Token (classic)** com escopo `read:packages`

---

## 3. Configurar Secrets e Variables no GitHub

Repositório → **Settings** → **Secrets and variables** → **Actions**.

### Secrets (aba _Secrets_)

| Secret                        | Valor                                                    |
| ----------------------------- | -------------------------------------------------------- |
| `CAPROVER_SERVER`             | URL do CapRover, ex: `https://captain.seudominio.com`    |
| `CAPROVER_BACKEND_APP_TOKEN`  | App Token do app backend (ver abaixo)                    |
| `CAPROVER_FRONTEND_APP_TOKEN` | App Token do app frontend                                |

> `GITHUB_TOKEN` é automático — não precisa criar (usado para push no GHCR).

**Onde achar o App Token:** no app do CapRover → **Deployment** →
**Enable App Token** → copie o token gerado.

### Variables (aba _Variables_)

| Variable                  | Valor                                              |
| ------------------------- | -------------------------------------------------- |
| `CAPROVER_BACKEND_APP`    | nome do app, ex: `receitas-backend`                |
| `CAPROVER_FRONTEND_APP`   | nome do app, ex: `receitas-frontend`               |
| `VITE_API_URL`            | URL pública da API, ex: `https://api.seudominio.com/api` |

---

## 4. Rodar

Faça um push na `main` (ou rode o workflow manualmente em **Actions →
CI/CD → Run workflow**). Os jobs `backend` e `frontend` rodam em paralelo.

As migrations do Prisma rodam automaticamente no start do container backend
(`prisma migrate deploy` no `CMD`).

---

## Build local (opcional, para testar as imagens)

```bash
# Backend
docker build -t receitas-backend ./backend
docker run --rm -p 3000:3000 --env-file backend/.env receitas-backend

# Frontend
docker build -t receitas-frontend \
  --build-arg VITE_API_URL=http://localhost:3000/api ./frontend
docker run --rm -p 8080:80 receitas-frontend
```
