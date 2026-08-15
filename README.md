# Eight34 ERM

Internal Enterprise Relationship Manager for the **Eight34 Labs** sales team. A Next.js app for tracking accounts, contacts, and pipeline, with sign-in gated to the Eight34 Slack workspace.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ecf8e?logo=supabase)](https://supabase.com)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)](https://eight34-erm.vercel.app)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue)](./LICENSE)
[![Internal](https://img.shields.io/badge/Eight34%20Labs-Internal-orange)](#-internal-project)

🔗 **Production:** [eight34-erm.vercel.app](https://eight34-erm.vercel.app)

## 🔒 Internal project

This is an internal tool for Eight34 Labs and is **not intended for use, deployment, or contribution outside the company**. Access is restricted to members of the authorized Eight34 Slack workspace; there is no public sign-up. The setup instructions below are for Eight34 engineers running the app locally.

## What it does

Eight34 ERM is the sales team's system of record for managing customer relationships and deal flow. Team members sign in with their Eight34 Slack account and get access to:

- **Accounts & contacts** — a central directory of companies and the people the team works with.
- **Pipeline tracking** — deals and their stages, with progress surfaced through dashboards.
- **Reporting** — charts and metrics (built on Recharts) for pipeline health and sales activity.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5, React 19 |
| Styling | Tailwind CSS 4 |
| UI components | Radix UI primitives, `lucide-react` icons |
| Charts | Recharts |
| Validation | Zod |
| Database & storage | [Supabase](https://supabase.com) (Postgres) via `@supabase/ssr` |
| Auth | Slack OAuth, session JWTs signed with `jose` |
| Hosting | [Vercel](https://vercel.com) |

## Project structure

```
app/
  (app)/        Authenticated app routes
  api/auth/     Slack OAuth callback + session handling
  login/        Sign-in page
  layout.tsx
  page.tsx
components/     Shared UI components
lib/            Supabase clients, auth, utilities
supabase/
  migrations/   Database schema migrations
  seed.sql      Seed data for local development
types/          Shared TypeScript types
middleware.ts   Route protection / session checks
```

## Getting started

### Prerequisites

- Node.js 20+
- Access to the Eight34 Supabase project (or your own project for local dev)
- Access to the Eight34 Slack app OAuth credentials

### Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/Eight34-Labs/eight34-erm.git
   cd eight34-erm
   npm install
   ```

2. **Configure environment variables**

   Copy the example file and fill in your values (see [Environment variables](#environment-variables)):

   ```bash
   cp .env.example .env.local
   ```

3. **Set up the database**

   Apply the migrations in `supabase/migrations/` to your Supabase project, and optionally load `supabase/seed.sql` for local development data.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build (`next build --webpack`) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Environment variables

Copy `.env.example` to `.env.local` and set the following:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — **server-side only, keep secret** |
| `SLACK_CLIENT_ID` | Slack app OAuth client ID |
| `SLACK_CLIENT_SECRET` | Slack app OAuth client secret |
| `SLACK_TEAM_ID` | Authorized Eight34 Slack workspace team ID — restricts who can sign in |
| `NEXTAUTH_URL` | App base URL (e.g. `http://localhost:3000` locally, `https://erm.e34labs.com` in prod) |
| `NEXTAUTH_SECRET` | Random 32+ character secret used to sign session tokens |

> **Never commit `.env.local` or any real secrets.** In production, set these in the Vercel project's Environment Variables.

## Deployment

The app deploys to **Vercel**. Pushes to `main` deploy to production. Set all [environment variables](#environment-variables) in the Vercel project settings, and make sure the Slack OAuth app's redirect URL and `NEXTAUTH_URL` point at the deployed domain.

## License

Licensed under the Apache License 2.0 — see [LICENSE](./LICENSE). Note that the license notwithstanding, this is an internal Eight34 Labs project (see [Internal project](#-internal-project)).
