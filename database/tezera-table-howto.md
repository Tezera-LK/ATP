# Tezera: make a database table, the simple way

**Version 1, 19 November 2026.** For every Tezera back-end developer. You do not need the person who made the first table. Written in the style of ASD-STE100 (Simplified Technical English): one action per step, short sentences, a check after each part, warnings before the step they protect.

Items marked **(proposed)** are not agreed. The team must confirm them. Items marked **(not verified)** were written from the repo files and the earlier plans, and were not run for this document. Check them when you do the step.

This document is the short version of `tezera-auth-setup-plan.md` (the full run, with Cognito and hosting). **It replaces the table steps in `tezera-table-creation-plan.md`.** That older plan assumed DynamoDB, Flutter and own auth tables. The repo does not use them for PostgreSQL tables.

## 1. The method in one minute

Every table follows the same five steps. Nothing else is allowed.

1. Start the database (Docker).
2. Write the table in `apps/api/prisma/schema.prisma`.
3. Run `pnpm exec prisma migrate dev --name <what_you_did>`. Prisma writes a SQL file and runs it.
4. Test it (section 6).
5. Commit `schema.prisma` and the new `migrations/` folder **together**.

| Rule | Reason |
| --- | --- |
| Change tables only with a Prisma migration. Never in DBeaver, never with `prisma db push`. | The migration files are the history. Your team mates run the same files. `db push` and DBeaver leave no file, so their database will differ from yours. |
| Never edit a migration that is already in `main`. Make a new one. | A changed file does not run again where it already ran. The databases then differ. |
| One migration folder per change. Give it a clear name. | `create_events`, `add_event_status`. Not `update`, not `test`. |
| Never commit `.env`. | It holds the database password. Only `.env.example` goes in git. |

## 2. What the repo already has

The code repo is `D:\IIT\Year 2\ATP\Project\tezera` (GitHub: Tezera-LK/tezera). **Do not make a second copy of anything in this table.**

| Item | What it is |
| --- | --- |
| `apps/api/docker-compose.yml` | PostgreSQL 16 in Docker. Container `tezera-db`. Port **5433** on your computer (5432 is often taken by another PostgreSQL). |
| `apps/api/.env.example` | The settings to copy into your own `.env`. Holds `POSTGRES_*` and `DATABASE_URL`. |
| `apps/api/prisma/schema.prisma` | Every table, written once. The first model is `User` (table `users`). |
| `apps/api/prisma/migrations/` | One folder per change, with a `migration.sql`. The first is `..._create_users`. |
| `apps/api/src/prisma/` | `PrismaModule` and `PrismaService`. Global. Your code uses them to read and write tables. |

> **WARNING: branch order.** These files are on the branch `feature/database-system`. The auth code (`feature/auth-backend`) imports `PrismaService` from them, so it does not compile without them. The database branch must be merged into `main` first. Until it is, start from `feature/database-system`, not from `main`. **(proposed)**

## 3. Install the tools (once)

Use PowerShell. After each install, close PowerShell and open it again.

| # | Tool | Install command | Check |
| --- | --- | --- | --- |
| 1 | Git | `winget install Git.Git` | `git --version` |
| 2 | Node.js 24 | `winget install OpenJS.NodeJS.LTS` | `node --version` (the repo needs 24) |
| 3 | pnpm | `corepack enable` | `pnpm --version` (12.14.0) |
| 4 | Docker Desktop | `winget install Docker.DockerDesktop` | `docker run --rm hello-world` |
| 5 | DBeaver Community (to look at tables) | `winget install dbeaver.dbeaver` | Open the app |

You do **not** need the AWS CLI, Cognito or an AWS account to make and test a table. Those are for login only (see the auth plan).

1. Run each missing command, in order.
2. Start Docker Desktop. Wait until it says "Engine running".

## 4. Set up the project (once)

1. Get the code. If you have it, skip the clone:

```powershell
git clone https://github.com/Tezera-LK/tezera.git
cd tezera
```

2. Go to the branch from section 2: `git checkout feature/database-system` (or `main` after the merge).
3. Install the packages: `pnpm install`.
4. Go to the API folder: `cd apps/api`.
5. Copy the settings file: `Copy-Item .env.example .env`.
6. Open `.env`. Write a long random password in two places: `POSTGRES_PASSWORD` and inside `DATABASE_URL`. They must match. Do not use the characters `@ : / ? #` in the password. They break the URL.
7. Start the database: `docker compose up -d`.
8. Make the tables on your computer from the migration files: `pnpm exec prisma migrate dev`.

> **CAUTION.** If `pnpm install` says a package "has a build script that was not approved", the list `allowBuilds` in `pnpm-workspace.yaml` must contain `'@prisma/client'`, `'@prisma/engines'` and `prisma` set to `true`. It already does in the repo. Do not remove those lines.

**Check (setup works).** All four must be true:

| Check | Command | You must see |
| --- | --- | --- |
| Database runs | `docker compose ps` | The `db` service shows `healthy` |
| Migrations applied | `pnpm exec prisma migrate status` | `Database schema is up to date!` |
| Table exists | `pnpm exec prisma studio` (opens a page in your browser) | A model `User` with 0 rows. Close it with Ctrl+C |
| Code compiles | `pnpm build` | No error |

If the API endpoint `GET /health/db` is on your branch (it is on `feature/auth-backend`), also run `pnpm dev` and open `http://localhost:4000/health/db`. It must say the database is up.

### Connect DBeaver (to look, not to change)

1. Open DBeaver. Choose **New Database Connection**, then **PostgreSQL**.
2. Host `localhost`, port `5433`. Database, user and password come from `.env`.
3. Click **Test Connection**. DBeaver may ask to download a driver. Allow it.
4. Click **Finish**. Set the connection to **manual commit** (toolbar button).
5. Open `tezera_dev` › `Schemas` › `public` › `Tables`. You see `users` and `_prisma_migrations`.

> **WARNING.** Do not create or change a table in DBeaver. Use a Prisma migration (section 5). DBeaver is for reading only.

> **WARNING.** `docker compose down -v` deletes the database volume and all your local data. For a normal stop, use `docker compose down` (no `-v`).

## 5. Make a new table

The example makes a table `venues`. Each venue belongs to one user. The example is for learning. Do not merge it. **The real columns are yours to decide.**

### 5.1 Before you write

1. Update your code: `git pull`, then `pnpm install`, then `pnpm exec prisma migrate dev`. This runs the migrations your team mates added.
2. Make your branch: `git checkout -b feature/db-venues`.
3. Answer these questions first. Write the answers in the pull request:
   - Does this table need PostgreSQL? Use PostgreSQL for data with links between rows (users, events, bookings). Chat and feeds go to DynamoDB, which is a different job (see `tezera-table-creation-plan.md`, section 7). **(proposed)**
   - Which role owns a row? Which role can read it?
   - Does it hold personal data (name, phone, ID photo)? If yes, tell the team. Sri Lanka's PDPA rules apply.

### 5.2 Write the model

Open `apps/api/prisma/schema.prisma`. Add the new model at the end. Then add one line to `User`.

```prisma
model Venue {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  ownerId   String   @map("owner_id") @db.Uuid
  name      String   @db.VarChar(120)
  city      String?  @db.VarChar(80)
  capacity  Int?
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  owner User @relation(fields: [ownerId], references: [id], onDelete: Restrict)

  @@index([ownerId])
  @@map("venues")
}
```

In `model User`, add this line before `@@map("users")`:

```prisma
  venues     Venue[]
```

Follow these naming rules. They match the `users` table.

| Rule | Example |
| --- | --- |
| Model name: singular, `PascalCase`. Table name: plural, `snake_case`, set with `@@map`. | `Venue` → `venues` |
| Column names: `camelCase` in code, `snake_case` in the database, set with `@map`. | `ownerId` → `owner_id` |
| Primary key: `id`, type `uuid`, set by the database. Copy the line from `User`. | `@default(dbgenerated("gen_random_uuid()")) @db.Uuid` |
| Every table has `created_at` and `updated_at` of type `timestamptz`. | Copy the two lines from `User` |
| A link to another table is `<thing>_id`, type `uuid`. Add `@@index` on it. PostgreSQL does not index a link by itself. | `@@index([ownerId])` |
| A fixed list of values is an `enum` with `@@map` (`snake_case`). | `UserRole` → `user_role` |
| Money is a whole number of cents, or `Decimal`. Never `Float`. | `priceCents Int` |
| Text with a limit: `@db.VarChar(n)`. Text without one: `String`. | `@db.VarChar(120)` |
| Do not store a password, a token, a card number or a raw date of birth. | Cognito holds them. |
| Use `onDelete: Restrict` for a link unless you have a reason. It stops a delete that would leave orphans. | See above |

### 5.3 Check the model

```powershell
pnpm exec prisma format
pnpm exec prisma validate
```

`format` fixes the spaces. `validate` must say `The schema at prisma\schema.prisma is valid`. If it shows an error, read the line number. The most common error is a missing line on the other side of a link (the `venues Venue[]` line in `User`).

### 5.4 Make the migration

```powershell
pnpm exec prisma migrate dev --name create_venues
```

Prisma does three things. It writes `prisma/migrations/<time>_create_venues/migration.sql`, runs it on your database, and rebuilds the code that your NestJS files import.

1. Open the new `migration.sql`. **Read all of it.** It must only make the table, the index and the link. If it has a `DROP`, stop. You or a team mate changed something by hand. Ask before you go on.
2. Ask one team mate to read the SQL in the pull request.

**You need a rule Prisma cannot write** (a `CHECK`, such as "email must be lower case")? Use two steps instead:

```powershell
pnpm exec prisma migrate dev --name create_venues --create-only
```

Open the new `migration.sql`. Add the rule at the end, for example:

```sql
ALTER TABLE "venues" ADD CONSTRAINT venues_capacity_positive
  CHECK (capacity IS NULL OR capacity > 0);
```

Then run it: `pnpm exec prisma migrate dev`.

### 5.5 Use the table in code

The `PrismaService` is global. Inject it, and call the model:

```ts
constructor(private readonly prisma: PrismaService) {}

createVenue(ownerId: string, name: string) {
  return this.prisma.venue.create({ data: { ownerId, name } });
}
```

> **WARNING.** Take `ownerId` from the checked login token (`req.user`). Never take it, or a role, from the request body.

## 6. Test that the table works

Run these in order, inside `apps/api`. Every line must pass.

| # | Test | Command or action | You must see |
| --- | --- | --- | --- |
| 1 | The schema is valid | `pnpm exec prisma validate` | `is valid` |
| 2 | The migration ran | `pnpm exec prisma migrate status` | `Database schema is up to date!` |
| 3 | The table exists | DBeaver: refresh `Tables` (F5) | `venues` is listed, with your columns |
| 4 | The link works | `pnpm exec prisma studio`. Add a user, then a venue with that user's `id` | The row saves |
| 5 | The rules hold | In Studio, add a venue with an `owner_id` that does not exist | An error (foreign key). If it saves, the link is missing |
| 6 | The code compiles | `pnpm build` | No error |
| 7 | The tests pass | `pnpm test` | All pass |
| 8 | A clean start works | `pnpm exec prisma migrate reset` (see warning), then `pnpm exec prisma migrate status` | Up to date. This proves a team mate can build the same database from your files |

> **WARNING.** `prisma migrate reset` deletes **all** data in the database in `DATABASE_URL`. Use it only on your own Docker database. Check `DATABASE_URL` points to `localhost:5433` first. Never run it on a hosted database.

Test 8 is the most important. It is the one that finds a missing migration file.

## 7. Share it with the team

1. Run `git status`. You must see changes in `prisma/schema.prisma` and a **new folder** under `prisma/migrations/`. If the folder is not there, your table will not exist for anybody else.
2. Check that `.env` is **not** in the list. It must not be.
3. Commit both together. Example message: `feat(db): add venues table`.
4. Push your branch and open a pull request into `main`. Put the answers from section 5.1 in it, and the test results from section 6.
5. After the review, merge. **After a merge, tell the team.** They run section 8.

## 8. A team mate merged a table: update yours

```powershell
git pull
pnpm install
cd apps/api
pnpm exec prisma migrate dev
```

`migrate dev` runs the new migration files on your database and rebuilds the code. If your code now shows red lines for the new model, run `pnpm exec prisma generate`, then restart your editor's TypeScript server.

## 9. Two people changed `schema.prisma` at once

This will happen. Follow the steps. They always work for **local** databases.

1. Your pull request shows a conflict in `schema.prisma`, or `migrate dev` says the migration history differs.
2. Update your branch with `main`: `git merge main`.
3. Open `schema.prisma`. Keep both people's models. Remove the conflict marks (`<<<<`, `====`, `>>>>`).
4. **Delete your own migration folder** (only yours, made on your branch). Do not delete the folders from `main`.
5. Reset your local database: `pnpm exec prisma migrate reset`. This applies the team's migrations from `main`.
6. Make your migration again: `pnpm exec prisma migrate dev --name create_venues`.
7. Commit, push, and run the tests in section 6.

**Prevention (proposed).** Say in the team chat when you start a table. Merge table pull requests one at a time. Keep a table pull request small: one table or one change.

## 10. When it goes wrong

| What you see | Cause | Fix |
| --- | --- | --- |
| `Can't reach database server at localhost:5433` | Docker is stopped, or the container is not healthy | Start Docker Desktop. Run `docker compose up -d`, then `docker compose ps` |
| `port is already allocated` on `docker compose up` | Port 5433 is in use | Change only the **left** number in `docker-compose.yml` (`127.0.0.1:5434:5432`). Change the port in `DATABASE_URL` and DBeaver to match. Do not commit this change |
| `Environment variable not found: DATABASE_URL` | No `.env` file, or you are in the wrong folder | Run the command inside `apps/api`. Make `.env` from `.env.example` (section 4) |
| `P1000 Authentication failed` | The password in `.env` does not match the one the container made first. The volume keeps the old password | Make the two `.env` passwords match the old one. Or, to start empty, `docker compose down -v` and `docker compose up -d` (deletes local data) |
| `Drift detected` or `The migrations ... are not in sync` | Somebody changed the database by hand, or you edited an old migration | Local only: `pnpm exec prisma migrate reset`. Then find who changed it by hand |
| `Prisma schema validation` error about a relation | One side of a link is missing | Add the matching line on the other model (section 5.2) |
| Red lines under `this.prisma.venue` | The generated code is old | `pnpm exec prisma generate`, restart the TypeScript server |
| `EPERM ... query_engine` on Windows | A running `pnpm dev` or Studio locks the engine file | Stop `pnpm dev` and Studio. Run the command again |
| `pnpm install` warns about ignored build scripts | `allowBuilds` was changed | Restore the three Prisma lines in `pnpm-workspace.yaml` (section 4) |
| `prisma` shows a newer major version (7+) and the setup files fail | The repo is pinned to Prisma 6 | Use `pnpm exec prisma` from `apps/api`, not a global `prisma` or `npx prisma@latest` |

## 11. What went right, what went wrong

This list comes from the earlier plans in this folder, the repo files, and the branch push on 19 November. It does not include chats that are not in the repo.

**Went right (keep).**

- One tool for tables: Prisma migrations. The files are the history.
- `.env.example` in git, `.env` ignored.
- Docker port 5433 and `127.0.0.1` only. No clash with a PostgreSQL that is already installed, and nobody on the network can connect.
- `--create-only`, then the `CHECK` rules added by hand. Prisma cannot write them.
- Prisma pinned to version 6, and `allowBuilds` listing Prisma in `pnpm-workspace.yaml`.
- DBeaver on manual commit, and read-only by rule.
- The auth plan was tested on a real run (Docker, migration, sandbox pool, `GET /health/db`, `GET /me`) before the steps were final.

**Went wrong (avoid).**

- **Version 1 of the auth plan assumed an empty repo.** The repo already had Cognito and an Amplify setup. The plan was rewritten twice. Read the repo first (section 2).
- **The 18 November table plan used a different design** (DynamoDB, Flutter, own `password_hash`, `refresh_tokens` and `otp_codes` tables). The repo uses Cognito and PostgreSQL with Prisma. Do not copy a table from an old plan. Check it against the repo.
- **`pnpm sandbox` fails on Windows.** Use `npx ampx sandbox --profile tezera` (auth plan, section 8).
- **Push order.** The auth branch imports `PrismaService`, so it needs the database branch. Push and merge the database branch first.
- **Two auth branches with similar names** (`feature/auth`, `feature/auth-backend`). Name a branch for one job. Delete it after the merge.
- **A newer Prisma major version** changes the setup files. Keep the pin.
- **A table changed by hand** (DBeaver or `db push`) leaves no file. Team mates do not get it.

## 12. Done when

- A new team mate can follow sections 3 and 4, and every check in section 4 passes.
- They can make a table by sections 5 to 7 without help.
- `migrate reset` on a clean database rebuilds every table from the files in `main` (test 8).
- No team mate has a table that is not in a migration file.

## 13. Open questions

1. **Where does the shared (hosted) database live?** Each person uses their own Docker database for now. A shared `dev` database needs a host (auth plan, section 9). Migrations run there with `pnpm exec prisma migrate deploy`, never `migrate dev` or `migrate reset`. The team decides the host and who owns the account.
2. **Who may approve a migration?** One reviewer for every `migration.sql`. Name them. **(proposed)**
3. **Seed data.** A test user and a few rows for each table help everybody. Add `prisma/seed.ts` and the `prisma.seed` setting? Not decided.
4. **Documents out of date.** The PRD, the architecture diagram and the work items still describe DynamoDB only on Amplify. They do not match the repo. The team must agree on the stack.
5. **Prisma 6 or newer.** Pinned to 6. Plan an upgrade.
