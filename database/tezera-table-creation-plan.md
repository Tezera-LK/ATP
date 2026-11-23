# Tezera: how to make a new database table

**Version 2, 20 November 2026** (version 1: 18 November 2026). For the Tezera team. Written in the style of ASD-STE100 (Simplified Technical English): one action per step, short sentences, warnings before the step they protect.

**What changed in version 2.** Auth is Amazon Cognito, not own NestJS auth. Section 8 now matches `database/tezera-auth-setup-plan.md` (version 3, built and run on 19 November 2026). Section 2 adds the AWS parts. Section 4 now sends every 1:1 chat and the WebSocket connection IDs to DynamoDB (version 1 named only organiser, vendor and freelancer chats). Section 11 marks the settled questions. PRD version 7 (20 November 2026) now describes this stack.

Items marked **(proposed)** are not yet agreed. The team must confirm them.

## 1. Purpose

This plan shows how to add a table (or an item type) to the Tezera database. Follow it every time. The first table is `users`, the table for the auth backend (section 8).

## 2. The stack

| Part | Choice |
| --- | --- |
| Web front end | Next.js, on AWS Amplify Hosting |
| Back end | NestJS (TypeScript), deployed as one AWS Lambda behind an Amazon API Gateway HTTP API (AWS CDK, `ap-south-1`) |
| Mobile app | Flutter (planned, not built: the code repo has no `apps/mobile`) |
| Sign-in | Amazon Cognito (defined with Amplify Gen 2 in `amplify/auth`) |
| Main database | PostgreSQL 16 (local Docker only today, on port 5433; the host for `dev` and `main` is not chosen) |
| Real-time and high-volume data | Amazon DynamoDB (planned, not built: no DynamoDB table in the code repo) |
| Live updates | Amazon API Gateway WebSocket API (planned, not built) |
| Schema tool for PostgreSQL | Prisma 6 |
| Code location | The team code repo `Tezera-LK/tezera` (this repo holds documents only) |

NestJS is the only part that reads or writes either database. The web and mobile apps call the NestJS API. They never connect to a database. **(proposed)**

## 3. Rules

> **WARNING.** Never change a table by hand in DBeaver, psql or the AWS console. Change it only through a migration (PostgreSQL) or the infrastructure code (DynamoDB). A hand change makes the database differ from the code, and the next deploy fails.

> **WARNING.** Never store a card number, a CVV or a plain-text password. Store a hash of each password.

> **WARNING.** Never copy a table that holds personal data (NIC, phone, email) into a test or demo environment without masking it. Sri Lanka's PDPA applies.

> **CAUTION.** Never edit a migration that another developer has already applied. Add a new migration instead.

> **CAUTION.** One table, one owner. Each table belongs to one NestJS module. Other modules use that module's service, not its table.

## 4. Choose the database

Answer the questions in order. Use the first answer that is "yes".

| # | Question | If yes |
| --- | --- | --- |
| 1 | Is it a 1:1 chat message (between any two users)? | DynamoDB |
| 2 | Is it an attendee feed item (post, like, comment, share)? | DynamoDB |
| 3 | Is it a community or event chat of attendees? | DynamoDB |
| 3a | Is it a WebSocket connection ID (live updates)? | DynamoDB |
| 4 | Does it need joins, strict rules (unique, foreign key) or transactions? | PostgreSQL |
| 5 | Does it hold money, bookings, accounts or verification? | PostgreSQL |
| 6 | None of the above | PostgreSQL |

PostgreSQL is the default. Use DynamoDB only for the cases above (questions 1 to 3a), where there are many writes and every read is a simple lookup by key.

**Cross-database links.** DynamoDB cannot have a foreign key to PostgreSQL. Store the PostgreSQL `users.id` as a plain string in the DynamoDB item. Check that the user exists in the NestJS service, before the write.

**Deleting a user.** The PDPA gives users the right to delete their data. A user deletion must remove or anonymise rows in both databases. Write a deletion step for every new table (section 5, step 8; section 7, step 9).

## 5. Steps: make a new PostgreSQL table

1. **Name the table's purpose.** Write one sentence. Write the PRD requirement IDs it serves (for example `AC-01`).
2. **Name the owner.** Choose one NestJS module.
3. **List the columns.** For each column, write the name, type, null or not null, default, and the reason it exists. Add only columns that a requirement needs (PDPA: collect only what a feature needs).
4. **Add the standard columns** (section 6).
5. **Draw the links.** Write each foreign key, and what happens on delete (`RESTRICT`, `CASCADE` or `SET NULL`). Choose `RESTRICT` unless you have a reason.
6. **Write the rules.** Add `UNIQUE`, `CHECK` and `NOT NULL` in the database, not only in the code.
7. **List the queries.** Write the 3 to 5 most common reads. For each one, add an index, or write why no index is needed. Do not add an index "just in case".
8. **Decide what happens to the data.** Write: who may read it, who may change it, how long it stays, and how it is deleted or anonymised (PDPA).
9. **Write the Prisma model** and make the migration (`prisma migrate dev --name add_<table>`). Read the generated SQL before you commit it.
10. **Seed test data** with a script. Use fake data only.
11. **Write the NestJS module:** the service, the DTOs (class-validator; the code repo has no Zod and no DTOs yet), and the access rules (which role may call what).
12. **Test.** Test the rules (a duplicate fails, a missing foreign key fails) and one query for each index.
13. **Open a pull request.** Fill in the review checklist (section 9).
14. **After merge,** update the table list in the data design document (section 10).

## 6. Naming and standard columns

| Rule | Example |
| --- | --- |
| Table names are plural, lower case, `snake_case` | `booking_requests` |
| Column names are `snake_case` | `created_at` |
| Primary key is `id`, type `uuid` (generated by the database) **(proposed)** | `id uuid primary key default gen_random_uuid()` |
| Foreign key is `<table singular>_id` | `event_id` |
| Booleans start with `is_` or `has_` | `is_verified` |
| Times are `timestamptz`, stored in UTC | `created_at` |
| Money is whole cents or a `numeric(12,2)`, never `float`. Currency is LKR | `fee_lkr numeric(12,2)` |
| Status values come from an enum or a `CHECK` list, not free text | `status` |

Every table has these columns:

| Column | Type | Use |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `created_at` | `timestamptz` | Set once, when the row is made |
| `updated_at` | `timestamptz` | Set on every change |
| `deleted_at` | `timestamptz`, null | Only for tables that use soft delete (state this in step 8) |

## 7. Steps: make a new DynamoDB table or item type

DynamoDB has no joins and no free-form queries. Design the reads before the table.

1. **Name the purpose and the owner.** Same as PostgreSQL steps 1 and 2.
2. **List the access patterns.** Write every read as a sentence with its sort order. Example: "Get the last 50 messages of one chat, newest first." Do this before anything else.
3. **Choose the keys.** Choose a partition key (`PK`) and a sort key (`SK`) so that each access pattern is one query on one partition.
4. **Add an index (GSI) only for a pattern the keys cannot serve.** Each GSI adds cost and write work.
5. **Check for a hot partition.** One key must not receive most of the traffic. Split it (for example `chat#id#2026-11`).
6. **Check the size.** One item holds at most 400 KB. Store files in S3 and keep only the link.
7. **Name the user field.** Store the PostgreSQL `users.id` as `userId` (string).
8. **Set the time to live (TTL)** if the data expires. Write the reason.
9. **Write the deletion step** for a user's items (PDPA).
10. **Write the table in the infrastructure code** (not in the console). Test it with a local DynamoDB or in your own `dev` copy.
11. **Write the NestJS service** with one method for each access pattern.
12. **Open a pull request** and fill in the review checklist (section 9).

**Planned DynamoDB uses (proposed keys, to confirm before building):**

| Use | Partition key | Sort key | Main read |
| --- | --- | --- | --- |
| Chat messages (organiser, vendor, freelancer) | `CHAT#<chatId>` | `MSG#<timestamp>#<messageId>` | Latest messages of a chat |
| A user's chat list | `USER#<userId>` | `CHAT#<lastMessageTime>` | Chats of a user, newest first |
| Attendee feed | `ORG#<organiserId>` | `POST#<createdAt>` | Posts of an organiser, newest first |
| Community or event chat | `ROOM#<roomId>` | `MSG#<timestamp>#<messageId>` | Latest messages of a room |

## 8. Worked example: the auth table

This is the first table. It connects the NestJS auth module to the database. It is built and tested: see `database/tezera-auth-setup-plan.md`, section 7 (the Prisma schema) and section 12 (the test run). This section gives only the summary.

**Purpose.** Link each Cognito user to one row that other tables can point to (AC-01). **Owner.** The `auth` NestJS module. **Database.** PostgreSQL (section 4, question 5).

### `users`

| Column | Type | Rules | Reason |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary key, set by the database | Our own ID. Used in other tables and in DynamoDB items |
| `cognito_sub` | `text` | Unique, not null | Links the row to the Cognito user |
| `email` | `text` | Unique, null allowed, lower case (`CHECK users_email_lower`) | From Cognito, only if verified |
| `phone` | `varchar(20)` | Unique, null allowed | From Cognito, only if verified (E.164, `+94...`) |
| `role` | enum `user_role` | Not null: `attendee`, `organiser`, `vendor`, `freelancer`, `admin` | A copy of the Cognito group. The group is the truth. A user can hold several groups. The API copies the highest-priority one (`admin`, then `organiser`, `vendor`, `freelancer`, `attendee`) |
| `status` | enum `user_status` | Values `pending`, `active`, `suspended`, `banned`. Default `active` | Admin actions (AD-02). The guard rejects any status except `active` |
| `created_at`, `updated_at` | `timestamptz` | Standard | |

**Rule.** `CHECK (email IS NOT NULL OR phone IS NOT NULL)` (named `users_contact_present`). Add it by hand in the migration SQL. Prisma cannot write a `CHECK` rule. The migration `20261118201220_create_users` also adds `users_email_lower`. These two `CHECK` rules are the only ones in the code repo today.

**When the row is made.** The API makes the row on the user's first request after sign-in. The guard checks the Cognito access token, reads the user's groups, and asks Cognito (`GetUser`) for the verified email or phone.

**Not in this table, and why.**

- No `password_hash`. Cognito holds passwords.
- No `date_of_birth` and no guardian column. Cognito holds the birthdate and the guardian tick, and its pre-sign-up function checks them (AC-01). The PDPA says: collect only what a feature needs.
- No `refresh_tokens` and no `otp_codes` tables. Cognito issues the tokens and sends the codes. (Version 1 of this plan had them. Do not make them.)

**Later, not now.** Profile data (name, logo, photo) goes in a separate `profiles` table. Verification documents (AC-08, AC-09) go in `verification_documents`. This keeps the auth table small and private.

## 9. Review checklist (copy into every pull request)

- [ ] The purpose and the PRD requirement IDs are in the description.
- [ ] The database choice follows section 4.
- [ ] Standard columns are present (PostgreSQL).
- [ ] Every foreign key states its delete rule.
- [ ] Rules are in the database, not only in the code.
- [ ] Every index has a query that needs it.
- [ ] The migration SQL was read by a second person.
- [ ] No personal data is in seed or test files.
- [ ] The deletion step (PDPA) is written.
- [ ] The access rules by role are written and tested.
- [ ] The table list in the data design document is updated.

## 10. Where to record it

Keep one data design document in the code repo. It lists every table, its owner, its database and its PRD IDs. Update it in the same pull request as the table. Copy a summary to `HANDOFF.md` in the documents repo when a stage is done.

## 11. Open questions for the team

Settled since version 1:

1. **One account, many roles?** Settled in the PRD: one role per account (PRD section 3 and AC-01). The code is looser: a user can hold several Cognito groups, and the API stores the highest-priority one in `users.role`. Sign-up allows only one role (`custom:role` cannot change), but an admin can add more groups by hand. Still open in PRD section 14: can one email address or phone number register separate accounts for different roles? Until the team decides, use one email, one account.
2. **Prisma or another tool?** Settled: Prisma 6. The first migration (`create_users`) is made and applied.
3. **Real-time chat delivery.** Settled in the design (PRD version 7, planned, not built): an API Gateway WebSocket API. Small Lambda functions keep the connection IDs in DynamoDB. DynamoDB Streams on the chat table send new messages to the connected users. Design the chat keys so that one stream record holds everything a client needs.
4. **Auth method.** Settled: Amazon Cognito. See section 8 and the auth setup plan.
6. **The PRD and the architecture diagram.** Settled for the PRD: version 7 describes PostgreSQL + DynamoDB with NestJS on Lambda. The architecture diagram is not redrawn yet (its new source is in the documents repo, `.archify/architecture-tezera-v7-20261120-235350/`).

Still open:

5. **Where do reviews, rank scores and leaderboards live?** This plan and PRD version 7 put them in PostgreSQL. The team must confirm.
7. **Which PostgreSQL host** for the shared `dev` and `main` stages? See the auth setup plan, section 9.
8. **How do you delete a user (PDPA)?** Delete or anonymise? Write one deletion step that covers both databases.
