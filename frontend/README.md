# Frontend - Receitas da Casa

Aplicação web desenvolvida com **React 19**, **Vite**, **TypeScript** e **Chakra UI v3**.

## Requisitos

- Node.js 20+
- npm

## Configuração inicial

### 1. Variáveis de ambiente

Copie o arquivo de exemplo e preencha a URL da API:

```bash
cp .env.example .env
```

Conteúdo do `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

> Ajuste a porta se o backend estiver rodando em outra URL.

### 2. Instalar dependências

```bash
npm install
```

## Executar o projeto

### Modo desenvolvimento (com hot reload)

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

### Build para produção

```bash
npm run build
```

Para preview do build:

```bash
npm run preview
```

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção (TypeScript + Vite) |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Executa o ESLint |

## Estrutura de rotas

| Rota | Descrição | Proteção |
|------|-----------|----------|
| `/` | Login | Pública |
| `/registro` | Cadastro | Pública |
| `/dashboard` | Dashboard principal | Privada |
| `/receitas` | Lista de receitas | Privada |
| `/receitas/nova` | Criar nova receita | Privada |
| `/receitas/:id` | Detalhe da receita (com CRUDs inline) | Privada |

## Autenticação

- JWT Access Token e Refresh Token armazenados no `localStorage`
- Rotas públicas redirecionam usuários logados para `/dashboard`
- Rotas privadas redirecionam usuários deslogados para `/`
- Refresh automático de token em caso de 401

## Tecnologias

- React 19
- React Router 7
- Vite 8
- TypeScript 6
- Chakra UI 3
- Axios (com interceptores)

## Arquitetura

O projeto segue uma arquitetura **feature-based**:

```
src/
  components/ui/     # Componentes genéricos reutilizáveis
  features/
    auth/            # Login, registro, contexto de autenticação
    recipes/         # CRUD de receitas, ingredientes, passos, notas
  pages/             # Páginas de alto nível
  routes/            # Configuração de rotas e guards
  services/          # Instância do Axios e interceptores
  theme/             # Design system do Chakra UI
```

## Rodando com o backend

1. Inicie o backend primeiro (`npm run start:dev` na pasta `backend/`)
2. Em outro terminal, inicie o frontend (`npm run dev` nesta pasta)
3. Acesse `http://localhost:5173`

Ou, na raiz do monorepo:

```bash
npm run dev
```

Isso inicia o backend e o frontend simultaneamente.
