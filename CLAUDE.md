# Receitas da Casa — workspace

Monorepo de um app web para cadastrar e organizar as receitas de uma casa. Tem duas partes:

- [backend/](backend/): API REST em NestJS 11, Prisma 7 e PostgreSQL. Detalhes em [backend/CLAUDE.md](backend/CLAUDE.md).
- [frontend/](frontend/): SPA em React 19, Vite 8, Chakra UI v3 e TanStack Query. Detalhes em [frontend/CLAUDE.md](frontend/CLAUDE.md).

A interface, as mensagens de erro e os comentários do código são em **português**. Identificadores (variáveis, funções, rotas da API, enums) são em inglês. As rotas do SPA são em português (`/receitas`, `/detalhes-da-receita/:id`).

## Modelo de domínio (importante)

- As receitas **não pertencem a um usuário**: o acervo é compartilhado e todo usuário logado vê e edita todas as receitas. A coluna `userId` foi removida de `Recipe` na migração `20260822120000_remove_user_from_recipe`. Não crie filtros por dono sem que isso seja pedido.
- O cadastro de novos usuários fica desligado por padrão (`ALLOW_NEW_USERS=false`). Nesse caso, `POST /api/auth/register` responde 404.
- Uma receita tem: grupos de ingredientes, modos de preparo com passos, notas, tags globais, fotos (uma capa e várias da galeria) e histórico de vezes que foi feita.
- Uma receita com `isPublic=true` aparece sem login em `/lista-de-receitas` e `/detalhes-da-receita/:id`, e o link dela ganha prévia (Open Graph) no WhatsApp e em apps parecidos.

## Comandos (na raiz)

```bash
npm install && npm --prefix backend install && npm --prefix frontend install
npm run dev            # backend (3000) + frontend (5173) juntos, via concurrently
npm run dev:backend    # só a API
npm run dev:frontend   # só o SPA
npm run build          # build dos dois
```

Lint: `npm --prefix backend run lint` (aplica `--fix`) e `npm --prefix frontend run lint`.

**Não há testes automatizados** em nenhum dos projetos. Para validar uma mudança, rode `npm run build` (o build do frontend roda `tsc -b`) e o lint, e teste o fluxo no app.

Requisitos: Node 20+ (as imagens Docker usam Node 22), PostgreSQL 14+ com a extensão `unaccent` e um bucket S3 ou compatível.

## Contrato entre front e back

- Todas as rotas da API têm o prefixo `/api`. O frontend lê a URL base de `VITE_API_URL` (ex.: `http://localhost:3000/api`).
- **Autenticação:** o access token é um JWT de 15 min enviado como `Authorization: Bearer` e guardado **só em memória** no front. O refresh token é opaco e fica num cookie `HttpOnly` chamado `refresh_token`, restrito ao path `/api/auth` e rotacionado a cada uso. As rotas `/auth/refresh` e `/auth/logout` exigem o header `X-Requested-With` (proteção contra CSRF). O CORS usa `FRONTEND_URL` com `credentials: true`.
- **Erros de validação** voltam como `400 { message: 'Dados inválidos', validation_errors: { campo: string[] } }`. No front, leia com `getApiErrorMessage` e `getApiFieldErrors`, de [parseError.ts](frontend/src/shared/utils/parseError.ts).
- **Paginação:** a query aceita `?page&limit` (o limite máximo é 1000) e a resposta vem como `{ data, meta: { total, page, limit, lastPage } }`.
- Filtros com array são enviados como `tags=a&tags=b`, sem colchetes. No axios, isso se faz com `paramsSerializer: { indexes: null }`.
- Os enums se repetem nos dois lados: `RecipeCategory` (`SWEET` ou `SAVORY`, exibidos como "Doce" e "Salgada") e `PhotoType` (`COVER` ou `USER`). Quando mudar a API, atualize também os tipos em `frontend/src/features/*/types.ts`, porque não há geração automática de tipos.

## Deploy

Todo push na `main` roda [.github/workflows/deploy.yml](.github/workflows/deploy.yml). A esteira faz o build das duas imagens Docker, publica no GHCR e faz o deploy no CapRover. O passo a passo completo está em [DEPLOY.md](DEPLOY.md).

- O backend roda `prisma migrate deploy` ao subir o container. Uma migração quebrada derruba o deploy.
- O `VITE_API_URL` é embutido no bundle durante o build (build-arg) e não pode ser trocado em runtime.
- O nginx do frontend envia os robôs de prévia de link para `GET /api/public/recipes/:id/preview`, pela rede interna do CapRover (`BACKEND_URL`).

## Convenções do repositório

- Os commits vão direto na `main`, sem criar branch.
- As mensagens de commit seguem Conventional Commits, em inglês, com escopo `api` ou `ui` quando a mudança é de um lado só. Exemplos: `feat(api): ...`, `fix(ui): ...`, `feat: ...` (quando afeta os dois lados), `chore: ...`, `fix(deps): ...`.
- Os READMEs estão **desatualizados** em alguns pontos: eles ainda dizem que os tokens ficam no `localStorage`, citam `JWT_REFRESH_SECRET` e descrevem uma estrutura de pastas antiga. Para auth e variáveis de ambiente, confie no código e nos arquivos `.env.example`.
- Nunca faça commit de arquivos `.env`.
