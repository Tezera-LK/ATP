# Tezera: set up the database and the auth table, step by step

**Version 3, 19 November 2026.** For the Tezera back-end developers. Written in the style of ASD-STE100 (Simplified Technical English): one action per step, short sentences, a check after each part, warnings before the step they protect.

Items marked **(proposed)** are not yet agreed. The team must confirm them. Items marked **(not verified)** were written from memory and not run. Check them when you do the step.

**What changed from version 1.** Version 1 assumed a new, empty code repo and a Cognito pool made with the AWS CLI. The team's code repo already exists, and it already defines Cognito with Amplify Gen 2. Version 2 fitted this plan to that repo and added a section on hosting the database (section 9). Version 3 records the real run on Windows: Docker port 5433, `npx ampx sandbox`, the web `ConfigureAmplify` problem, the tested code, and the web link in section 12. The tests in section 11 that were run are marked.

This plan **replaces section 8 and question 4 of `tezera-table-creation-plan.md`**. Auth uses Amazon Cognito, not own NestJS auth. There is no `password_hash`, `refresh_tokens` or `otp_codes` table.

## 1. What you build

When you finish, you have:

- a PostgreSQL database that runs on your computer (Docker) and a plan for the hosted one;
- one table in it: `users`, linked to Cognito by the user's Cognito ID (`sub`);
- Cognito, made by the repo's Amplify code (`npx ampx sandbox`, see section 8);
- a NestJS API (`apps/api`) that checks the Cognito token and reads and writes `users`;
- the endpoints `GET /health`, `GET /health/db` and `GET /me`.

### How the parts work together

1. The web app signs the user up and in **with Cognito** (Amplify libraries). The API never sees a password.
2. At sign-up, a Cognito function checks the age and the role. Another function adds the user to a Cognito **group** for the role.
3. Cognito gives the app an **access token** (a JWT). The token lists the user's groups.
4. The app sends the token to the API: `Authorization: Bearer <token>`.
5. The API checks the token with Cognito's public keys.
6. The API finds the user's row by the Cognito `sub`. On the first request, it makes the row. It copies the role from the group.

| Data | Where it lives |
| --- | --- |
| Password, email and phone checks, birthdate, guardian tick, tokens | Cognito |
| The role (the truth) | The Cognito group |
| The role (a copy), status, `sub`, email, phone | PostgreSQL `users` |
| Name, photo, logo, interests | Later: a `profiles` table |

> **WARNING.** The API must never take a role from the request body. It takes the role only from the Cognito group in a checked token.

## 2. What the repo already has

The code repo is `D:\IIT\Year 2\ATP\Project\tezera` (GitHub: Tezera-LK/tezera). **Read this table before you start. Do not make a second copy of anything in it.**

| Item | What it is |
| --- | --- |
| `package.json`, `pnpm-workspace.yaml`, `turbo.json` | A pnpm and Turborepo monorepo. Use `pnpm`, not `npm`. Node 24 and pnpm 12 |
| `apps/api` | The NestJS API. Local entry: `src/main.ts` (port 4000). Lambda entry: `src/lambda.ts` |
| `apps/web` | The Next.js web portal |
| `amplify/auth/resource.ts` | The Cognito user pool, as code. Sign-in by email or phone. Groups: `attendee`, `organiser`, `vendor`, `freelancer`, `admin`. Custom attributes: `custom:role`, `custom:guardian`, `custom:setup`. Standard attribute: `birthdate` |
| `amplify/auth/pre-sign-up` | Checks the role and the age (16 or more, guardian tick for 16 and 17) before an account is made |
| `amplify/auth/post-confirmation` | Adds the new user to the group for the role. Never to `admin` |
| `infra/lib/api-stack.ts` | AWS CDK. Deploys `apps/api` as one Lambda behind an HTTP API, in `ap-south-1`. Stages `dev` and `main` |
| `pnpm sandbox` | Runs `ampx sandbox --profile tezera`. **It fails on Windows** (see section 8). Makes **your own test copy** of the Amplify backend (your own Cognito pool) in AWS |

**What this plan adds:** `docker-compose.yml`, `prisma/`, the auth code and the `users` table, all inside `apps/api`.

> **CAUTION.** The Cognito code in `amplify/` belongs to the team members who wrote it. Do not change it without asking them. If the `users` table needs a Cognito change, ask first.

## 3. Install the tools

Use PowerShell. After each install, close PowerShell and open it again.

| # | Tool | Install command | Check |
| --- | --- | --- | --- |
| 1 | Git | `winget install Git.Git` | `git --version` |
| 2 | Node.js 24 | `winget install OpenJS.NodeJS.LTS` | `node --version` (the repo needs 24) |
| 3 | pnpm | Comes with the repo (`packageManager` in `package.json`). If missing: `corepack enable` | `pnpm --version` (12.14.0) |
| 4 | Docker Desktop | `winget install Docker.DockerDesktop` | `docker run --rm hello-world` |
| 5 | DBeaver Community | `winget install dbeaver.dbeaver` | Open the app |
| 6 | AWS CLI v2 | `winget install Amazon.AWSCLI` | `aws --version` |

1. Run each missing command, in order.
2. Start Docker Desktop. Wait until it says "Engine running".
3. In the repo folder, run `pnpm install`.

> **CAUTION.** If you already have PostgreSQL on this computer, it may use port 5432. Section 5 uses port 5433 to avoid it.

## 4. Connect the AWS CLI (IAM user with MFA)

The Tezera AWS account has a policy `tezera-require-mfa`. It denies almost everything until you sign in with MFA. The console and the CLI both follow this rule.

### 4.1 Set up MFA (one time)

1. Sign in to the AWS console as your IAM user.
2. Open IAM, then Users, then your user, then Security credentials.
3. Click **Assign MFA device**. Choose **Authenticator app**. Name it, for example `yourname-desktop-totp`.
4. Click **Show QR code**. Scan it with an authenticator app. If you have no phone app, use an authenticator in the browser or a desktop app (for example KeePassXC). Click **Show secret key** to type the key by hand.
5. Enter two codes in a row. Click **Add MFA**.
6. **Sign out of the console. Sign in again with a code.** A session that started before MFA stays blocked.

> **WARNING.** Do not choose "Passkey or security key". It works for the console only. The CLI command in section 4.3 needs a 6-digit code.

> **WARNING.** Keep a backup of the authenticator secret. If you lose it, the team lead must reset your MFA.

### 4.2 Make an access key (one time)

1. In the console, open Security credentials. Click **Create access key**.
2. Choose **Command Line Interface (CLI)**. Tick the box. Click **Next**.
3. Write the description `tezera-cli`. Click **Create access key**.
4. Run `aws configure --profile tezera-base`. Enter the key ID, the secret key, and the region `ap-south-1`.
5. Delete any downloaded `.csv` file with the key.

> **WARNING.** The secret key is a password. Never put it in the repo, in `.env`, or in chat. If it leaks, deactivate and delete the key in IAM at once.

### 4.3 Get an MFA session (every 12 hours)

The base key alone is blocked by the MFA policy. Ask AWS for a session with MFA. Read the 6-digit code from your authenticator. Replace `000000` with it and `<DEVICE_NAME>` with your device name. Copy the full ARN from Security credentials in the console. The name is whatever you typed when you added the device (for example `tezera-yevan-desktopQR`). Keep the command on one line.

```powershell
$j = aws sts get-session-token --profile tezera-base --serial-number arn:aws:iam::014675907306:mfa/<DEVICE_NAME> --token-code 000000 --duration-seconds 43200 | ConvertFrom-Json
```

Check: `$j.Credentials.AccessKeyId` must print a key that starts with `ASIA`. If it prints nothing, the command failed. Read a new code and try again.

Then save the session in the profile `tezera`. The Amplify sandbox command uses this profile name.

```powershell
aws configure set aws_access_key_id     $j.Credentials.AccessKeyId     --profile tezera
aws configure set aws_secret_access_key $j.Credentials.SecretAccessKey --profile tezera
aws configure set aws_session_token     $j.Credentials.SessionToken    --profile tezera
aws configure set region ap-south-1 --profile tezera
aws sts get-caller-identity --profile tezera
```

The last command must print your user. After 12 hours the session ends. Run section 4.3 again.

**Errors.**
- `MultiFactorAuthentication failed`: the code changed, the code is missing, or the device name is wrong. Use a fresh code. Copy the ARN from the console.
- `AccessDenied` on a later command: your IAM user lacks that permission. Send the exact error to the team lead.

> **CAUTION.** Set an AWS Budgets alert (for example USD 5) before you make resources. **(not verified: the current free-tier rules)**

## 5. Start PostgreSQL on your computer

Work in `apps/api`. The database runs in Docker. It is for daily work and tests. The hosted database is in section 9.

1. Run `cd "D:\IIT\Year 2\ATP\Project\tezera\apps\api"`.
2. Make the file `.env.example` (this one goes in git). **Put this text in its own file. Never put it in `.gitignore`.**

```
# PostgreSQL (Docker, local)
POSTGRES_USER=tezera
POSTGRES_PASSWORD=change-me
POSTGRES_DB=tezera_dev
DATABASE_URL=postgresql://tezera:change-me@localhost:5433/tezera_dev?schema=public

# Cognito: from amplify_outputs.json after the sandbox runs (section 8)
AWS_REGION=ap-south-1
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=

# API
PORT=4000
WEB_ORIGIN=http://localhost:3000
```

3. Copy it: `Copy-Item .env.example .env`. The root `.gitignore` already ignores `.env` and keeps `.env.example`.
4. Open `.env`. Write a long random password in two places: `POSTGRES_PASSWORD` and inside `DATABASE_URL`. They must match. Do not use the characters `@ : / ? #` in the password. They break the URL.
5. Make the file `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16
    container_name: tezera-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "127.0.0.1:5433:5432"
    volumes:
      - tezera_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  tezera_pgdata:
```

6. Start it: `docker compose up -d`.
7. Check: `docker compose ps`. The `db` service must show `healthy`.

The line `127.0.0.1:5433:5432` lets only your own computer connect. Keep it. The left number (5433) is the port on your computer. The right number (5432) is the port inside the container. This plan uses 5433 because many computers already use 5432 for another PostgreSQL. If port 5433 is also busy, change only the left number, and change the port in `DATABASE_URL` and DBeaver to match.

> **WARNING.** `docker compose down -v` deletes the database volume and all data. Use `docker compose down` (no `-v`) for a normal stop.

## 6. Connect DBeaver (to look, not to change)

1. Open DBeaver. Choose **New Database Connection**, then **PostgreSQL**.
2. Host `localhost`, port `5433`. Database, user and password come from `.env`.
3. Click **Test Connection**. DBeaver may ask to download a driver. Allow it.
4. Click **Finish**.
5. Set the connection to **manual commit** (the toolbar button). This stops a stray `UPDATE` from saving by itself.

> **WARNING.** Do not create or change a table in DBeaver. Make every change with a Prisma migration (section 7). DBeaver is for reading only.

## 7. Add Prisma and make the `users` table

The tool is Prisma **(proposed)**. These steps use **Prisma 6**. A newer major version changes the setup files. Pin version 6 so that this plan works. **(not verified against the version you get)**

1. Open `pnpm-workspace.yaml` in the repo root. The key `allowBuilds` lists the packages that may run install scripts. Add these three lines under it, and keep the others:

```yaml
  '@prisma/client': true
  '@prisma/engines': true
  prisma: true
```

2. From the repo root, install Prisma into the API:

```powershell
pnpm --filter @tezera/api add @prisma/client@6
pnpm --filter @tezera/api add -D prisma@6
```

3. Make the folder `apps/api/prisma` and the file `apps/api/prisma/schema.prisma`:

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-arm64-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  attendee
  organiser
  vendor
  freelancer
  admin

  @@map("user_role")
}

enum UserStatus {
  pending
  active
  suspended
  banned

  @@map("user_status")
}

model User {
  id         String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  cognitoSub String     @unique @map("cognito_sub")
  email      String?    @unique
  phone      String?    @unique @db.VarChar(20)
  role       UserRole
  status     UserStatus @default(active)
  createdAt  DateTime   @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt  DateTime   @updatedAt @map("updated_at") @db.Timestamptz(6)

  @@map("users")
}
```

The `binaryTargets` line adds the engine for the Lambda (ARM, Linux). Keep it.

4. Go to the API folder: `cd apps/api`.
5. Make the migration, but do not apply it yet:

```powershell
pnpm exec prisma migrate dev --name create_users --create-only
```

6. Open the new file `prisma/migrations/<time>_create_users/migration.sql`.
7. Add these lines at the end. Prisma cannot write a `CHECK` rule, so you add them by hand:

```sql
ALTER TABLE "users" ADD CONSTRAINT users_contact_present
  CHECK (email IS NOT NULL OR phone IS NOT NULL);
ALTER TABLE "users" ADD CONSTRAINT users_email_lower
  CHECK (email IS NULL OR email = lower(email));
```

8. Read the whole SQL file. Ask a second person to read it.
9. Apply it: `pnpm exec prisma migrate dev`.
10. Check in DBeaver: open `tezera_dev` › `Schemas` › `public` › `Tables`. The table `users` must be there, and `_prisma_migrations` too.

### The `users` table, column by column

| Column | Type | Rules | Reason |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary key, set by the database | Our own ID. Used in other tables and in DynamoDB items |
| `cognito_sub` | `text` | Unique, not null | Links the row to the Cognito user |
| `email` | `text` | Unique, null allowed, lower case | From Cognito, only if verified |
| `phone` | `varchar(20)` | Unique, null allowed | From Cognito, only if verified (E.164, `+94...`) |
| `role` | enum `user_role` | Not null | A copy of the Cognito group. The group is the truth |
| `status` | enum `user_status` | Default `active` | Admin actions (AD-02) |
| `created_at`, `updated_at` | `timestamptz` | Standard | |

- **Why no `password_hash`?** Cognito holds passwords.
- **Why no `date_of_birth` or guardian column?** Cognito already holds the birthdate and the guardian tick, and its pre-sign-up function checks them (AC-01). Not copying them follows the PDPA rule: collect only what a feature needs. Add them later if a feature needs them.
- **Why no `email_verified_at`?** The API creates the row only after Cognito says the email or phone is verified.
- **Why no `deleted_at`?** Section 14, question 4 asks how to delete a user (PDPA).
- **`updated_at`.** Prisma sets it. A raw SQL `INSERT` must set it too. Write through Prisma.

## 8. Cognito: use the repo's Amplify code

Do **not** make a user pool with the AWS CLI. The repo already defines it. Make your own test copy with the repo script.

1. Do section 4.3 first. The session in profile `tezera` must be fresh.
2. From the repo root, run the sandbox. The first run takes several minutes. Leave it running.

   - **Windows:** run `npx ampx sandbox --profile tezera`. The script `pnpm sandbox` fails with "Amplify does not support PNPM on Windows". Amplify reads the variable `npm_config_user_agent`, which pnpm sets. `npx` does not set it to pnpm.
   - **Mac or Linux:** run `pnpm sandbox`.
   - Run it from the repo root. In another folder, pnpm says "Command sandbox not found".
3. If it says `AccessDenied`, your IAM user lacks a permission that Amplify needs. Send the exact error to the team lead. **(not verified: which policy Amplify needs)**
4. When it finishes, it prints "Watching for file changes" and writes `amplify_outputs.json` in the repo root. It is in `.gitignore`. Do not commit it. If VS Code shows the file empty, close its tab and open it again. It is a stale tab.
5. Open it. Under `auth`, copy `user_pool_id` and `user_pool_client_id`.
6. Write them in `apps/api/.env`: `COGNITO_USER_POOL_ID` and `COGNITO_CLIENT_ID`.

> **CAUTION.** Your sandbox is your own copy. It has its own user pool, with its own users. The shared `dev` and `main` copies are made by Amplify Hosting from the branches. They have other pool IDs. See section 14, question 2.

> **CAUTION.** `ampx sandbox` costs money while it runs, though little. Stop it with Ctrl+C when you finish for the day. Delete it with `npx ampx sandbox delete --profile tezera` when you no longer need it. **(not verified: the exact command)**

### Make a test user

The easy way: use the web app.

1. Start the web app: `pnpm dev:web`. Open the sign-up page.
2. Sign up with a real email address that you can read. Choose the role `attendee`. Use a birthdate that makes you 18 or older.
3. Enter the 6-digit code from the email. Cognito's built-in email sender has a small daily limit (about 50 a day). **(not verified)**
4. The post-confirmation function adds you to the group `attendee`.

> **CAUTION. Web app and `ConfigureAmplify` (found in the run).** On `main`, `apps/web/src/components/ConfigureAmplify.tsx` is active and `apps/web/src/app/(auth)/[role]/layout.tsx` uses it. It reads `amplify_outputs.json` from `apps/web/`. That file is in `.gitignore` and the sandbox writes it in the repo root. So copy it: `Copy-Item amplify_outputs.json apps\web\` after each sandbox start. Without it, the web app fails to build ("Module not found") or sign-up fails with `NoAmplifyContextError`. Do not comment out `ConfigureAmplify` to work around it, and do not commit such a change. (In the run, Yevan did this in a commit; it was removed before the pull request.)

The other way: use the CLI. This skips the email code. The Cognito functions do **not** run for a user made like this, so you add the group by hand. Use a fake email address.

```powershell
aws cognito-idp admin-create-user --region ap-south-1 --user-pool-id <POOL_ID> --username test1@example.com --message-action SUPPRESS --user-attributes Name=email,Value=test1@example.com Name=email_verified,Value=true Name=birthdate,Value=2000-05-01 Name=custom:role,Value=attendee

aws cognito-idp admin-set-user-password --region ap-south-1 --user-pool-id <POOL_ID> --username test1@example.com --password "Test-Pass-123" --permanent

aws cognito-idp admin-add-user-to-group --region ap-south-1 --user-pool-id <POOL_ID> --username test1@example.com --group-name attendee
```

### Get an access token for tests

The pool's app client may not allow password sign-in from the CLI (the `USER_PASSWORD_AUTH` flow). **(not verified)** The web app uses the SRP flow. Use the browser instead.

1. Sign in to the web app as the test user.
2. Open the browser developer tools (F12). Open **Application**, then **Local Storage**.
3. Find the key that ends in `.accessToken`. The full key is `CognitoIdentityServiceProvider.<client id>.<user id>.accessToken`. If you do not see it, you are not signed in, or you look under the wrong site (use `http://localhost:3000`).
4. Click the row and copy the **value** (not the key name). It starts with `eyJ`. This is the access token. It lasts about one hour. Do not copy `idToken`.

> **WARNING.** An access token is a password for one hour. Do not paste it in chat or commit it.

## 9. Host the database

The team plans to host the database. This section helps the team choose. **The host is not chosen yet.** Nothing in sections 5 to 8 depends on the choice. Prisma reads one setting, `DATABASE_URL`.

### 9.1 Facts about this repo that decide the choice

- The API runs as an AWS **Lambda**. In `infra/lib/api-stack.ts` it is **not inside a VPC**. It has the internet.
- The API calls Cognito over the internet: `aws-jwt-verify` downloads Cognito's public keys, and `GetUser` calls Cognito.
- A Lambda starts many copies when traffic grows. Each copy opens its own database connection. PostgreSQL has a small connection limit. A **connection pooler** between the Lambda and PostgreSQL stops this problem.
- The CDK stack sets `timeout: Duration.seconds(10)`. A slow first connection can break it.

### 9.2 The options

| | A. Amazon RDS for PostgreSQL, private | B. Amazon RDS, public endpoint | C. Hosted PostgreSQL service with a pooler (for example Supabase or Neon) |
| --- | --- | --- | --- |
| Where | Your AWS account, `ap-south-1` | Your AWS account, `ap-south-1` | The provider's cloud. Check its region list |
| Lambda connects | The Lambda must move into the VPC | Over the internet | Over the internet |
| Cognito access from the Lambda | Needs a NAT gateway (about USD 30 a month, **not verified**) or a VPC endpoint for Cognito | Not changed | Not changed |
| Connection pooling | RDS Proxy (extra cost) | RDS Proxy (extra cost) | Built in (the pooler URL) |
| Security | Best: no public address | Weak: a public address and a password only. Never use `0.0.0.0/0` for the real data | Public address with TLS and a password |
| Set-up work | High: VPC, subnets, security groups, CDK | Medium | Low |
| Cost for a uni project | Highest | Medium | Lowest. Free tiers exist **(not verified: limits)** |
| Managed in the repo | Yes, in `infra/` (CDK) | Yes, in `infra/` | No. Made in the provider's web page |

### 9.3 The suggestion (proposed)

For the ATP release, use **option C** for the shared `dev` stage. It is the cheapest and quickest, and it needs no change to the Lambda network. Keep PostgreSQL in Docker on each computer for daily work. Move to **option A** if the team needs all data inside the AWS account, or when real users arrive.

**The team must check before choosing:**
1. The provider has a region close to Sri Lanka (for example Mumbai or Singapore). **(not verified)**
2. The free tier limits: storage, how long a project may sleep, and whether it pauses after inactivity. **(not verified)**
3. PDPA: does the plan allow data to sit outside Sri Lanka? Ask the lawyer (PRD section 14).
4. Backups: how often, and how long the provider keeps them. **(not verified)**
5. Who owns the account. Use a team email address, not one person's.

### 9.4 Steps for any host

1. **Make the database.** Name it `tezera_dev` for the `dev` stage. Choose the region you picked.
2. **Make two database users.**
   - `tezera_migrate`: may create and change tables. Used only for migrations.
   - `tezera_app`: may only read and write rows (`SELECT`, `INSERT`, `UPDATE`, `DELETE`). Used by the API.
3. **Get two connection strings.**
   - **Pooled** (for the API): the pooler address and port. Add `?sslmode=require&connection_limit=1`. With Supabase or Neon, also add `&pgbouncer=true`. **(not verified: the exact parameters for your host)**
   - **Direct** (for migrations): the normal database address. Add `?sslmode=require`.
4. **Tell Prisma about both.** In `schema.prisma`, change the `datasource` block:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

   `DATABASE_URL` is the pooled string. `DIRECT_URL` is the direct string. Prisma uses the direct string for migrations. Add `DIRECT_URL` to `.env.example`. For your local Docker database, give both the same value.
5. **Apply the migrations to the hosted database** from your computer or from CI. Use `deploy`, not `dev`:

```powershell
pnpm exec prisma migrate deploy
```

   Set `DIRECT_URL` and `DATABASE_URL` to the hosted strings for that one command. Do not save them in `.env`.
6. **Keep the secrets out of git and out of plain text.** Store the pooled string in AWS Systems Manager Parameter Store (`SecureString`) or AWS Secrets Manager. The Lambda reads it when it starts. The CDK stack needs permission to read it. **Do not** write the string in `api-stack.ts` or in a Lambda environment variable that CDK sets from a file in git. Anyone who can open the Lambda page can read an environment variable.
7. **Check the connection** with `GET /health/db` on the deployed API (section 11).

> **WARNING.** Never run `prisma migrate dev` or `prisma migrate reset` on a hosted database. They can delete data. Use `migrate deploy` only.

> **WARNING.** Never copy real personal data from a hosted database into a local one without masking it (PDPA).

### 9.5 Changes the API stack needs (not done)

These are gaps in `infra/lib/api-stack.ts` today. Do them as a separate task, with the team member who owns `infra/`.

1. **Environment.** The Lambda has only `WEB_ORIGIN` now. It needs the Cognito pool ID, the Cognito client ID, and a way to read the database string (item 6 above). The Lambda sets `AWS_REGION` by itself.
2. **Bundling.** Remove `'class-validator'` and `'class-transformer'` from `externalModules` in the CDK file. The comment there says "we don't use them". The API code in section 10 uses them. If they stay external, the Lambda fails at start.
3. **Prisma in the Lambda.** The bundle must contain the Prisma engine file for ARM Linux (`linux-arm64-openssl-3.0.x`, set in section 7). esbuild does not copy it by itself. A common fix is to list `@prisma/client` and `prisma` under `bundling.nodeModules` and to copy `schema.prisma` with a command hook. **(not verified: try it and fix)**
4. **Timeout and memory.** Raise the 10-second timeout if the first request after a long pause is slow.

## 10. Write the NestJS code

All paths are in `apps/api`.

### 10.1 Install the packages

```powershell
pnpm --filter @tezera/api add @nestjs/config aws-jwt-verify class-validator class-transformer
pnpm --filter @tezera/api add @aws-sdk/client-cognito-identity-provider
```

(The AWS SDK is listed as external in the CDK file. The Lambda runtime has it.) **(not verified: that these versions work with Nest 12)**

### 10.2 The files

```
src/
  main.ts                (edit)
  lambda.ts              (edit)
  setup.ts               (new)
  app.module.ts          (edit)
  app.controller.ts      (edit)
  prisma/
    prisma.module.ts
    prisma.service.ts
  auth/
    auth.module.ts
    auth.controller.ts
    auth.guard.ts
    roles.guard.ts
    roles.decorator.ts
    roles.ts
    cognito.service.ts
```

The `auth` module owns the `users` table. Other modules call its services. They never read the table.

### 10.3 Prisma service

`src/prisma/prisma.service.ts`:

```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

`src/prisma/prisma.module.ts`:

```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
```

### 10.4 Roles from groups

`src/auth/roles.ts`. The role names match the Cognito groups. The order decides which role wins if a user is in two groups.

```ts
import { UserRole } from '@prisma/client';

const ROLE_ORDER: UserRole[] = ['admin', 'organiser', 'vendor', 'freelancer', 'attendee'];

export function roleFromGroups(groups: unknown): UserRole | undefined {
  if (!Array.isArray(groups)) return undefined;
  return ROLE_ORDER.find((r) => groups.includes(r));
}
```

`src/auth/roles.decorator.ts`:

```ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

### 10.5 Cognito service

It checks the token and reads the user's verified email or phone.

`src/auth/cognito.service.ts`:

```ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

export interface AccessTokenPayload {
  sub: string;
  'cognito:groups'?: string[];
}

@Injectable()
export class CognitoService {
  private readonly verifier: { verify(token: string): Promise<AccessTokenPayload> };
  private readonly client: CognitoIdentityProviderClient;

  constructor(config: ConfigService) {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: config.getOrThrow<string>('COGNITO_USER_POOL_ID'),
      clientId: config.getOrThrow<string>('COGNITO_CLIENT_ID'),
      tokenUse: 'access',
    });
    this.client = new CognitoIdentityProviderClient({
      region: config.get<string>('AWS_REGION') ?? 'ap-south-1',
    });
  }

  // Throws if the token is bad, expired, or from another pool or client.
  verifyAccessToken(token: string) {
    return this.verifier.verify(token);
  }

  // The access token has no email. Ask Cognito for the user's attributes.
  async getVerifiedContact(accessToken: string) {
    const out = await this.client.send(new GetUserCommand({ AccessToken: accessToken }));
    const a = Object.fromEntries((out.UserAttributes ?? []).map((x) => [x.Name, x.Value]));
    return {
      email: a['email_verified'] === 'true' ? a['email']?.toLowerCase() : undefined,
      phone: a['phone_number_verified'] === 'true' ? a['phone_number'] : undefined,
    };
  }
}
```

### 10.6 Guards

`src/auth/auth.guard.ts` checks the token. It reads the role from the groups. It makes the `users` row the first time. It keeps the role copy up to date.

```ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CognitoService } from './cognito.service';
import { roleFromGroups } from './roles';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private cognito: CognitoService, private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const header: string | undefined = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedException();
    const token = header.slice(7);

    let payload;
    try {
      payload = await this.cognito.verifyAccessToken(token);
    } catch {
      throw new UnauthorizedException();
    }

    const role = roleFromGroups(payload['cognito:groups']);
    if (!role) throw new ForbiddenException('ROLE_MISSING');

    let user = await this.prisma.user.findUnique({ where: { cognitoSub: payload.sub } });
    if (!user) {
      const { email, phone } = await this.cognito.getVerifiedContact(token);
      if (!email && !phone) throw new ForbiddenException('CONTACT_NOT_VERIFIED');
      try {
        user = await this.prisma.user.create({
          data: { cognitoSub: payload.sub, email, phone, role },
        });
      } catch {
        // Two first requests at once: the other one made the row.
        user = await this.prisma.user.findUnique({ where: { cognitoSub: payload.sub } });
        if (!user) throw new ForbiddenException('PROFILE_FAILED');
      }
    } else if (user.role !== role) {
      user = await this.prisma.user.update({ where: { id: user.id }, data: { role } });
    }

    if (user.status !== 'active') throw new ForbiddenException('ACCOUNT_NOT_ACTIVE');
    req.auth = payload;
    req.user = user;
    return true;
  }
}
```

`src/auth/roles.guard.ts`. Use it after `AuthGuard`. A route without `@Roles(...)` lets any active user in.

```ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    const user = ctx.switchToHttp().getRequest().user;
    if (roles && !roles.includes(user.role)) throw new ForbiddenException('ROLE_NOT_ALLOWED');
    return true;
  }
}
```

### 10.7 Controller and module

`src/auth/auth.controller.ts`. The route `organiser/ping` is a test only. Delete it later.

```ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller()
export class AuthController {
  @Get('me')
  @UseGuards(AuthGuard, RolesGuard)
  me(@Req() req) {
    return req.user;
  }

  @Get('organiser/ping') // test only
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('organiser')
  ping() {
    return { ok: true };
  }
}
```

`src/auth/auth.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { CognitoService } from './cognito.service';

@Module({
  controllers: [AuthController],
  providers: [CognitoService, AuthGuard, RolesGuard],
  exports: [CognitoService, AuthGuard, RolesGuard],
})
export class AuthModule {}
```

### 10.8 Edit the existing files

`src/app.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

`src/app.controller.ts`. Keep the existing routes. Add the database check:

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('health/db')
  async healthDb() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  }
}
```

The app starts in two places: `main.ts` (local) and `lambda.ts` (AWS). Put the shared setup in one file so that the two cannot differ. `src/setup.ts`:

```ts
import { INestApplication, ValidationPipe } from '@nestjs/common';

export function configureApp(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000' });
}
```

In `src/main.ts`, replace the line `app.enableCors(...)` with `configureApp(app);`. Add `import { configureApp } from './setup';`.

In `src/lambda.ts`, do the same: replace `app.enableCors(...)` with `configureApp(app);` and add the import.

> **NOTE (found in the run).** Typing errors caused these bugs: a misspelled class name (`PrismaModule`), `AuthModule` and `ConfigModule` missing from `AppModule.imports`, a misspelled `req.headers.authorization` (every call got 401), and a leading space in the region `ap-south-1` and in `'true'`. Copy the code exactly.

> **CAUTION.** I did not compile this code. Run `pnpm --filter @tezera/api build` and fix any type error. The repo uses Nest 12 and TypeScript 6. The code uses features from older versions. **(not verified)**

## 11. Run it and test it

1. Start PostgreSQL: `docker compose ps` in `apps/api` (the `db` service must be `healthy`).
2. Check that `apps/api/.env` has the two Cognito IDs from section 8.
3. Start the API: `pnpm --filter @tezera/api dev`.
4. In a second window, run `Invoke-RestMethod http://localhost:4000/health/db`. It must print `status: ok`.
5. Put the access token in a variable: `$t = "<the token>"`. Keep the quotes. Check it: `$t.Split('.').Count` must print `3`.

> **NOTE.** The routes are `/me`, `/health`, `/health/db` and `/organiser/ping`. There is no `/auth` prefix. A `404 Cannot GET /auth/me` means a wrong path. Write each command on one line. A line break after `Invoke-RestMethod` makes PowerShell ask for `Uri`.

**Run on 19 November 2026 (Yevan):** `/health/db` ok; `/me` with a token made the row; the web log in made the row for a second user. Tests 1, 2 and 4 to 8 were not yet run.

### Test cases

| # | Test | Command | Result |
| --- | --- | --- | --- |
| 1 | No token | `Invoke-RestMethod http://localhost:4000/me` | 401 |
| 2 | A token from a user with no group | `/me` with the token | 403 `ROLE_MISSING` |
| 3 | Attendee, first request | `Invoke-RestMethod http://localhost:4000/me -Headers @{Authorization="Bearer $t"}` | The new row. `role` is `attendee` |
| 4 | Same request again | Same command | The same row. No second row in DBeaver |
| 5 | Role check | `Invoke-RestMethod http://localhost:4000/organiser/ping -Headers @{Authorization="Bearer $t"}` | 403 `ROLE_NOT_ALLOWED` |
| 6 | Role change | Add the user to the group `organiser` (below). Sign in again. Use the **new** token for test 5 | 200 `ok`. The row's `role` is now `organiser` |
| 7 | Suspended user | In DBeaver, set the row's `status` to `suspended` (a test row only). Call `/me` | 403 `ACCOUNT_NOT_ACTIVE` |
| 8 | Database rule | In DBeaver, run `INSERT INTO users (cognito_sub, role, updated_at) VALUES ('x','attendee',now());` | Fails: no email and no phone. Roll back |

Test 6, add the group:

```powershell
aws cognito-idp admin-add-user-to-group --region ap-south-1 --user-pool-id <POOL_ID> --username test1@example.com --group-name organiser
```

After test 3, check the database. In DBeaver, run `SELECT * FROM users;`. You must see one row with your `cognito_sub`, `email` and `role`.

## 12. Connect the web app

The web app uses the Amplify libraries for sign-in. It must call the API with the access token. This was done and tested on 19 November 2026.

The file `apps/web/next.config.ts` already has a rewrite. The browser calls `/api/...`, and Next.js sends it to the API (`API_URL`, default `http://localhost:4000`). So the browser needs no API address and no CORS setting.

1. Make `apps/web/src/lib/api.ts`:

```ts
import { fetchAuthSession } from "aws-amplify/auth";

// Call the Tezera API with the signed-in user's access token.
// "/api/..." is rewritten to the API in next.config.ts.
export async function apiFetch(path: string, init: RequestInit = {}) {
  const { tokens } = await fetchAuthSession();
  const token = tokens?.accessToken.toString();
  return fetch(`/api${path}`, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}` },
  });
}
```

2. In `apps/web/src/lib/session.ts`, add `import { apiFetch } from "./api";`. In `checkRoleAfterLogin`, when the role is right, call the API before the return:

```ts
  if (user && user.groups.includes(role)) {
    // Make the user's row in the API database on first log in.
    await apiFetch("/me").catch(() => undefined);
    return { ok: true, path: pathAfterLogin(role, user.setup) };
  }
```

`checkRoleAfterLogin` runs after every successful log in. The first call makes the row. Later calls only read it. A failed API call does not block the log in.

3. Restart the web app (the rewrite is read at start).
4. Test: sign up a **new** user, confirm the code, log in. Then run:

```powershell
docker exec tezera-db psql -U tezera -d tezera_dev -c "select email, phone, role, status from users;"
```

You must see a row for the new user. (Result on 19 November 2026: yes.)

> **WARNING.** The apps never connect to PostgreSQL. They call the API only.

> **CAUTION.** `session.ts` belongs to the team member who wrote the web sign-in. Tell them about this change.

The mobile app does not exist in the repo yet. It will use the same flow: sign in with Cognito, take the access token, send it as a Bearer header.

## 13. Done when

- [x] `docker compose ps` shows `healthy` (19 Nov 2026).
- [x] `GET /health/db` returns `ok` (19 Nov 2026).
- [ ] The migration is in git (committed by a team member), and a second person read its SQL.
- [ ] Tests 1 to 8 in section 11 pass (3 and 4 run; the rest not run).
- [x] A new web log in makes a `users` row (section 12, 19 Nov 2026).
- [ ] `.env` and `amplify_outputs.json` are not in git. `.env.example` is.
- [ ] The `users` table is listed in the data design document (table creation plan, section 10).
- [ ] The team chose the database host (section 9) and confirmed the items marked **(proposed)**.

## 14. Open questions and gaps

1. **Where to host the database.** See section 9. The team decides. Choose the host, the region, and who owns the account.
2. **Cognito IDs for the deployed API.** Your sandbox has its own pool. The `dev` and `main` stages have other pools. The API stack must know the right IDs for each stage. Options: read them from `amplify_outputs.json` at deploy time, or store them in Parameter Store. Not decided.
3. **Secrets for the deployed API.** Store the database string in Parameter Store or Secrets Manager (section 9.4, step 6). The CDK stack needs the change.
4. **Deleting a user (PDPA).** Needs a step that deletes the Cognito user (`AdminDeleteUser`) and the `users` row, and anonymises rows in other tables. Not written yet.
5. **Role in two places.** The group is the truth. The `users.role` column is a copy, updated at the next request. Is the copy needed? It helps joins and reports. Confirm.
6. **Admin accounts.** Added by hand to the group `admin` in the AWS console (the repo's decision). The API makes the row on the first request. Make a safe admin flow before the admin panel.
7. **Organiser verification (AC-08).** Not part of `status` now. It needs its own table and an admin step.
8. **Phone-only users.** The pool allows phone sign-in without a password. Such a user has `phone` and no `email`. The `CHECK` rule allows it. Test it.
9. **Google sign-in (later).** Such users have no role group until the setup screen. The API returns 403 `ROLE_MISSING` until a group is set. Plan how the group is added.
10. **Prisma 6 or newer.** Pinned to 6 so that the steps stay the same. Plan an upgrade.
11. **Documents out of date.** The PRD, the architecture diagram and the work items still describe a serverless Amplify stack with DynamoDB only. They do not match the repo and this plan until the team agrees. The repo README tech-stack table still says TBC.

## 15. What comes next

1. Do section 9.5: update the API stack (environment, bundling, Prisma engine, secrets).
2. Choose and make the hosted database. Run `prisma migrate deploy` on it.
3. Add `profiles` (name, photo) and the organiser, vendor and attendee profile tables (AC-02 to AC-05).
4. Add `verification_documents` and the admin approval step (AC-08).
5. Add DynamoDB for chat (see `tezera-table-creation-plan.md`, section 7).
