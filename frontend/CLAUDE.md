# Frontend — SPA Receitas da Casa

SPA em React 19 com TypeScript 6, Vite 8, Chakra UI v3, TanStack Query v5, React Router 7 (`createBrowserRouter`), axios e react-toastify. Para o contexto geral do projeto, veja [../CLAUDE.md](../CLAUDE.md).

## Comandos

```bash
npm run dev       # Vite em http://localhost:5173
npm run build     # tsc -b && vite build (é aqui que os erros de tipo aparecem)
npm run lint      # eslint (typescript-eslint + react-hooks + react-refresh)
npm run preview
```

- A única variável de ambiente é `VITE_API_URL` (padrão `http://localhost:3000/api`). Ela é embutida no build.
- O alias `@/` aponta para `src/`.
- O TS roda com `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (use `import type` para tipos) e `erasableSyntaxOnly` (sem `enum` nem parameter properties).

## Estrutura ([src/](src/))

```
main.tsx            AuthProvider > App
App.tsx             QueryClient (staleTime 5min, retry 1, sem refetch no foco) + ChakraProvider + ToastContainer + Router
routes/             index.tsx (rotas), PrivateLayout (Navbar + ProtectedRoute), PublicRoute, ScrollToTop
theme/index.ts      createSystem do Chakra: tokens de cor primary/secondary/beige/yellow/neutral e fontes
shared/
  services/api.ts   instância axios autenticada (tokens, refresh, CSRF)
  components/ui/    EditableBlock, ViewBlock, ConfirmDialog, CoverUploader, FilterDropdown, EmptyState...
  hooks/useDraftRows.ts   estado de listas editáveis (linhas de rascunho com tempId/serverId e deletedIds)
  utils/            parseError, prepareImage, share, search, constants (CATEGORY_META, COVER_GRADIENT)
features/<nome>/    auth, dashboard, recipes, tags, public
  pages/ components/ hooks/ services/ types.ts index.ts
```

Cada feature segue o mesmo fluxo: o `services/*.service.ts` faz as chamadas axios, os `hooks/use*.ts` embrulham essas chamadas em `useQuery`/`useMutation`, e as `pages/` e `components/` consomem os hooks. Os tipos ficam em `types.ts` e são escritos à mão para espelhar a API.

## Rotas

| Rota | Página | Acesso |
|---|---|---|
| `/` e `/cadastro` | Login e Register | `PublicRoute` (quem está logado vai para `/dashboard`) |
| `/dashboard`, `/receitas`, `/receitas/nova`, `/receitas/:id` e `/tags` | Dashboard, List, Form, Detail e Tags | `PrivateLayout` (quem não está logado vai para `/`) |
| `/lista-de-receitas` e `/detalhes-da-receita/:id` | PublicRecipeList e PublicRecipeDetail | abertas, sem layout |

Qualquer outra rota redireciona para `/`. **Não mude o caminho `/detalhes-da-receita/:id`**: o [nginx.conf.template](nginx.conf.template) depende dele para gerar as prévias de link, e o [share.ts](src/shared/utils/share.ts) monta essa URL.

## Autenticação ([api.ts](src/shared/services/api.ts) e [useAuth.ts](src/features/auth/hooks/useAuth.ts))

- O access token fica **só em memória**, numa variável do módulo. Para definir, use `setAccessToken`. **Não use `localStorage`.**
- Ao abrir o app, `useAuthState` chama `refreshSession()`, que restaura a sessão pelo cookie HttpOnly. Enquanto isso, `isLoading` vale `true`.
- Num 401, o interceptor faz um refresh e repete a request uma vez. O `refreshSession` deduplica chamadas simultâneas e usa `navigator.locks` para serializar entre abas, porque o token rotaciona e um uso duplo seria visto como roubo. A sessão só é encerrada se o refresh responder 401; erro de rede ou 5xx mantém o usuário logado.
- Login e logout são sincronizados entre abas via `BroadcastChannel('auth')`.
- A instância envia `withCredentials: true` e o header `X-Requested-With` em toda request.
- As páginas públicas usam outra instância, [publicApi.ts](src/features/public/api/publicApi.ts), sem auth nem cookies.

## Dados (TanStack Query)

- As chaves de query são `['recipes', ...]` para listas (inclusive `['recipes', 'infinite', filtros]`), `['recipe', id]` para o detalhe, `['tags']` para tags e `['public-recipes', ...]` e `['public-recipe', id]` para as páginas públicas.
- As mutations ficam em [useRecipes.ts](src/features/recipes/hooks/useRecipes.ts) e invalidam `['recipe', id]` e, quando a mudança aparece em cards (título, tags, capa, ingredientes, histórico), também `['recipes']`. Ao mudar uma tag, invalide também as receitas (veja `invalidateTagsAndRecipes` em [useTags.ts](src/features/tags/hooks/useTags.ts)). Ao criar uma mutation nova, mantenha essa regra.
- A lista `/receitas` usa `useInfiniteRecipesQuery`, que faz a busca (`q`), filtra por categoria e tags no servidor, cancela a request anterior via `signal` e mantém o resultado anterior na tela com `keepPreviousData`.
- [useRecipeQueries.ts](src/features/recipes/hooks/useRecipeQueries.ts) é uma cópia antiga e sem uso de hooks que já existem em `useRecipes.ts`. Importe de `useRecipes.ts`.

## Edição de receitas

- `/receitas/nova` ([Form.tsx](src/features/recipes/pages/Form.tsx)) cria só a parte básica (título, descrição, categoria e `isPublic`, que vem como `true` por padrão) e redireciona para o detalhe.
- O detalhe ([Detail.tsx](src/features/recipes/pages/Detail.tsx)) é editado por blocos. Cada bloco usa `EditableBlock` (ver e editar, com Salvar e Cancelar). O texto do bloco fica em `useRecipeDrafts`, e as listas (ingredientes, modos de preparo, passos, notas) usam `useDraftRows`. Ao salvar, o componente compara os rascunhos com o servidor e dispara criações, edições e remoções individuais na API, porque não existe endpoint de salvar tudo de uma vez.
- Tags são globais. Se a tag digitada não existe, o detalhe cria a tag e depois a vincula à receita.
- Fotos passam por `prepareImageForUpload` ([prepareImage.ts](src/shared/utils/prepareImage.ts)), que redimensiona para no máximo 1920 px e converte para JPEG 0.92 no navegador (isso resolve fotos HEIC do iPhone e o limite de 8 MB). GIFs são bloqueados. A compressão final é feita pelo backend. A capa tem `positionY` (0–100) para o enquadramento vertical.

## UI e estilo

- Use os componentes do **Chakra UI v3** (API nova: `Field`, `Switch`, `Dialog` etc., `loading` em vez de `isLoading`) com tokens do tema (`primary.500`, `beige.100`, `neutral.800`...). Evite CSS solto.
- Os componentes ficam responsivos com `useBreakpointValue({ base: true, md: false })`, que gera a flag `mobile`. O app é muito usado no celular, inclusive no Safari do iOS e iPadOS, e houve correções específicas para ele. Teste os dois tamanhos.
- Tipografia: Montserrat no corpo, Fraunces nos títulos (`fontFamily` aplicado inline), Caveat nos textos de destaque acima do título e JetBrains Mono (todas carregadas no [index.html](index.html)).
- Ícones vêm de `react-icons/lu` (Lucide). O feedback ao usuário usa `toast` do `react-toastify`, com mensagens em português, e `getApiErrorMessage(err, 'fallback')` para mostrar erros da API.
- Para mostrar a categoria, use `CATEGORY_META` (rótulo e cores de "Doce" e "Salgada").

## Build e deploy

O [Dockerfile](Dockerfile) faz o build com Node 22 e serve o resultado com nginx 1.27. O nginx faz o fallback de rotas do SPA, o cache imutável de `/assets/` e o proxy das prévias para robôs (`BACKEND_URL`).

## Cuidados

- `tagsService.update` e `useUpdateTagMutation` chamam `PATCH /tags/:id`, **que não existe no backend**. Hoje ninguém usa esses dois. Se precisar editar tags, implemente a rota na API primeiro.
- Não há testes. Valide com `npm run build`, `npm run lint` e testando no navegador.
