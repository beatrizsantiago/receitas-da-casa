# Backend — API Receitas da Casa

API REST em NestJS 11, Prisma 7 (usa o driver adapter `@prisma/adapter-pg`) e PostgreSQL. Para o contexto geral do projeto, veja [../CLAUDE.md](../CLAUDE.md).

## Comandos

```bash
npm run start:dev        # watch mode, porta 3000 (PORT)
npm run build            # nest build -> dist/
npm run lint             # eslint --fix (type-checked + prettier)
npm run format           # prettier
npx prisma migrate dev --name <nome>   # cria e aplica uma migração em dev
npx prisma generate                    # regenera o client depois de mudar o schema
```

- O Swagger fica em `/api/docs` e **só sobe com `NODE_ENV=development`**.
- A config do Prisma está em [prisma.config.ts](prisma.config.ts) e lê `DATABASE_URL` via dotenv. O `schema.prisma` não tem `url` no datasource.
- O Prettier usa aspas simples e trailing comma `all`.

## Variáveis de ambiente

Veja a lista completa em [.env.example](.env.example). As principais:

- `DATABASE_URL`
- `FRONTEND_URL`: usada no CORS e nas URLs da prévia de link.
- `JWT_SECRET` e `JWT_EXPIRES_IN` (padrão `15m`).
- `REFRESH_TOKEN_TTL_DAYS` (30), `SESSION_MAX_AGE_DAYS` (90) e `REFRESH_COOKIE_SAMESITE` (`strict`, `lax` ou `none`; um valor inválido derruba a API na subida, e `none` exige `NODE_ENV` diferente de `development`).
- `ALLOW_NEW_USERS`
- `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET` e `AWS_S3_ENDPOINT` (opcional; serve para MinIO, R2 e outros, e ativa o `forcePathStyle`).

O `StorageService` usa `getOrThrow` nas variáveis da AWS, então **a API não sobe sem elas**, nem em dev.

## Arquitetura

O código fica em `src/`, com um módulo Nest por recurso (`controller` + `service` + `dto/`):

| Módulo | Rotas (com o prefixo `/api`) |
|---|---|
| `auth` | `POST auth/register\|login\|refresh\|logout\|logout-all` |
| `recipes` | `recipes` (CRUD + `GET` com `q`, `category`, `tags[]` e paginação) |
| `public-recipes` | `GET public/recipes`, `GET public/recipes/:id` e `GET public/recipes/:id/preview` (HTML) |
| `ingredient-groups` | `recipes/:recipeId/ingredient-groups` e `ingredient-groups/:id` |
| `ingredients` | `ingredient-groups/:id/ingredients` e `ingredients/:id` |
| `preparation-methods` | `recipes/:recipeId/preparation-methods` e `preparation-methods/:id` |
| `steps` | `preparation-methods/:id/steps` e `steps/:id` |
| `recipe-notes` | `recipes/:recipeId/notes` e `notes/:id` |
| `tags` | `GET/POST tags`, `DELETE tags/:id`, `POST recipes/:id/tags` e `DELETE recipes/:id/tags/:tagId` |
| `photos` | `POST photos` (multipart: `file`, `type`, `recipeId`) e `PATCH photos/:id` (`positionY`) |
| `history` | `GET/POST recipes/:recipeId/history` |
| `users`, `prisma`, `storage` | apenas providers (`PrismaModule` é `@Global`) |

### Itens globais (configurados em [app.module.ts](src/app.module.ts) e [main.ts](src/main.ts))

- `JwtAuthGuard` é um `APP_GUARD`, então **toda rota exige JWT por padrão**. Para liberar uma rota, use `@Public()` de [public.decorator.ts](src/common/decorators/public.decorator.ts). O usuário logado vem de `@CurrentUser()` como um `JwtPayload` (`{ sub, email, sid }`).
- `ThrottlerGuard` limita a 120 req/min por IP. As rotas de auth têm `@Throttle` próprio, e o app usa `trust proxy` porque roda atrás do nginx do CapRover.
- `ValidationPipe` roda com `whitelist`, `forbidNonWhitelisted` e `transform`. **Um campo que não está no DTO gera 400.** O formato do erro é `{ message: 'Dados inválidos', validation_errors }`.
- O app também usa `helmet`, `cookie-parser` e o `LoggingInterceptor` (registra método, URL e tempo).

### Padrões ao criar ou alterar recursos

- **DTOs:** use `class-validator` com mensagens em português e `@ApiProperty` com `example`. Os DTOs de update usam `PartialType` de `@nestjs/mapped-types`.
- **Paginação:** estenda `PaginationDto` de [pagination.dto.ts](src/common/dto/pagination.dto.ts) (ele tem o getter `skip`) e responda no formato `{ data, meta: { total, page, limit, lastPage } }`.
- **Recursos filhos de uma receita:** o service chama `recipesService.findOne(recipeId)` antes de qualquer operação, para validar que a receita existe e não está apagada (gera 404 com "Receita não encontrada"). Os módulos filhos importam `RecipesModule` por causa disso. Siga o mesmo padrão.
- **Ordenação:** `IngredientGroup`, `PreparationMethod` e `Step` têm `@@unique([parentId, order])`. Para reordenar, atualize em uma ordem que não colida; o frontend já faz isso. `Ingredient.order` não tem índice único.
- Os controllers só recebem os parâmetros (com `ParseIntPipe` nos ids) e repassam para o service. Também levam `@ApiTags` e `@ApiBearerAuth('access-token')`.

## Autenticação e sessões ([src/auth/](src/auth/))

- Login e registro criam uma `Session` e um `RefreshToken`. O banco guarda **só o SHA-256** do token.
- O `/auth/refresh` lê o cookie `refresh_token`, marca o token como usado de forma atômica (`updateMany ... usedAt: null`) e emite um novo. Um token reapresentado depois de `REUSE_GRACE_MS` (10 s) é tratado como roubo e **revoga a sessão inteira**.
- O `JwtStrategy.validate` confere em cada request se a sessão (`sid`) continua ativa, por isso o logout vale na hora.
- O refresh token **nunca** vai no corpo da resposta, só no cookie (`respondWithSession`).
- Refresh e logout exigem o header `X-Requested-With` (`CsrfHeaderGuard`).
- As senhas usam bcrypt com custo 10.

## Busca de receitas ([recipes.service.ts](src/recipes/recipes.service.ts))

- Sem `q`, a listagem usa `findMany` do Prisma com filtros de categoria e de tags (a receita precisa ter **todas** as tags informadas) e ordena por `createdAt desc`.
- Com `q`, a listagem usa SQL cru (`$queryRaw`) com `unaccent(lower(...))`, procurando em título (peso 10), tags (5), ingredientes (3) e descrição (2). Todos os termos precisam aparecer, e o resultado vem ordenado por relevância. Os termos passam por `escapeLike`. **A extensão `unaccent` é obrigatória** (migração `20260928120000`).
- A listagem devolve os campos calculados `cooks` (quantas vezes a receita foi feita) e `lastCooked` (`mapRecipe`).
- A listagem pública ([public-recipes.service.ts](src/public-recipes/public-recipes.service.ts)) usa `select` explícito para não expor campos internos, ignora `q` e filtra tags com lógica OU (`some in`), diferente da rota privada.
- O HTML da prévia ([recipe-preview.html.ts](src/public-recipes/recipe-preview.html.ts)) escapa todo valor vindo do banco e só aceita URLs http(s).

## Fotos

- O upload aceita JPEG, PNG ou WebP de até 8 MB, via `FileInterceptor`. O `sharp` aplica `rotate()` (orientação do EXIF), redimensiona para caber em 1920x1920 sem ampliar e converte para WebP com qualidade 85.
- A chave no S3 segue o formato `recipes/{recipeId}/{cover|user}/{uuid}.webp`.
- Para trocar a capa, o código primeiro envia o arquivo novo e depois, numa transação com `SELECT ... FOR UPDATE` na receita, troca o registro da capa. O arquivo antigo só é apagado depois do commit. Se a transação falhar, o arquivo novo é removido.
- Apagar uma receita (`DELETE /recipes/:id`) é **definitivo**: remove as fotos do S3 e apaga a linha, e os filhos saem por cascade. A coluna `deletedAt` existe e é filtrada nas consultas, mas nada a preenche hoje.

## Banco e migrações

- O schema fica em [prisma/schema.prisma](prisma/schema.prisma) e as migrações em `prisma/migrations/` (nome no formato `YYYYMMDDHHMMSS_descricao`).
- Ao alterar o schema, crie uma migração com `prisma migrate dev`. Em produção, as migrações são aplicadas na subida do container, então elas precisam funcionar sobre dados existentes.
- `Tag.name` é único e global. `DELETE tags/:id` falha com 400 se a tag estiver em uso.

## Cuidados

- **Não existe `PATCH /tags/:id`**, embora o frontend tenha um `tagsService.update` (que hoje não é usado).
- [app.controller.ts](src/app.controller.ts) e `app.service.ts` são restos do scaffold e não estão registrados no `AppModule`.
- Não há testes. Valide as mudanças com `npm run build`, `npm run lint` e o Swagger em dev.
