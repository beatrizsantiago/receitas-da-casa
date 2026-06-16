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

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
