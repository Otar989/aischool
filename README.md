# AI Learning Platform

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/otars-projects-e6e83f1d/v0-image-analysis-mp)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/uB7udcY36zD)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/otars-projects-e6e83f1d/v0-image-analysis-mp](https://vercel.com/otars-projects-e6e83f1d/v0-image-analysis-mp)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/uB7udcY36zD](https://v0.app/chat/projects/uB7udcY36zD)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Настройка

1) Скопируйте `.env.example` в `.env` и заполните значениями из Supabase:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - DATABASE_URL (Postgres connection string)
2) Задать те же переменные в Vercel (Production и Preview), затем Redeploy.
3) (Быстрое наполнение) В Supabase → SQL Editor можно выполнить:
   \`\`\`sql
   create extension if not exists pgcrypto;
   create table if not exists public.courses (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     slug text unique not null,
     description text,
     price numeric default 0,
     image_url text,
     is_published boolean default true,
     created_at timestamptz default now()
   );
   insert into public.courses (title, slug, description, is_published)
   values ('Demo course','demo','Базовый демо-курс', true)
   on conflict (slug) do nothing;
   \`\`\`
4) Либо после деплоя выполнить сидер:
   \`\`\`bash
   curl -X POST https://<your-vercel-domain>/api/seed-course
   \`\`\`
5) Откройте /courses — должен быть список курсов.

## Seeding Data

For development or administrative tasks you may need to populate the database
with demo content. Use one of the following secured methods:

1. **Server script** – run the provided database seed scripts from your server
   environment, e.g. `pnpm run db:seed` or the SQL files in `scripts/`.
2. **Admin endpoint** – start the application with `ENABLE_SEED_COURSE=true` to
   expose the protected `POST /api/seed-course` route and seed sample courses via
   an HTTP request. Make sure this flag is disabled in production.

Both approaches avoid exposing the Supabase service-role key to the client.

## Supabase Configuration

The course modules rely on Supabase for data. Configure the following environment variables (see `.env.example` for ready-to-use values):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
