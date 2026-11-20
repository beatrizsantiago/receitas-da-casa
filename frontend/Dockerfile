# syntax=docker/dockerfile:1

# ─────────────────────────────────────────
# Stage 1 — Build (Vite gera os estáticos)
# ─────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# VITE_API_URL é embutido no bundle em build-time.
# Vem do build-arg definido no workflow de CI/CD.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ─────────────────────────────────────────
# Stage 2 — Runtime (nginx servindo o SPA)
# ─────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# O entrypoint do nginx gera o default.conf a partir do template na subida,
# substituindo só as variáveis que passam no filtro abaixo
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

# Endereço interno do backend (rede do CapRover), usado só para gerar a
# prévia de links das receitas. Pode ser sobrescrito nas env vars do app.
ENV BACKEND_URL=http://srv-captain--receitas-backend:3000
ENV NGINX_ENVSUBST_FILTER=^BACKEND_URL$

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
