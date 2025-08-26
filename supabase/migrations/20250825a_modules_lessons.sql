-- Create modules and ensure lessons table (with module_id) exists before course_materials
-- Timestamp chosen to sort BEFORE 20250826_course_materials.sql

-- Modules table
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- Lessons table (extended). If it already exists, add missing columns.
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  title text not null,
  description text,
  content text,
  order_index int not null default 0,
  duration_minutes int,
  is_demo boolean default false,
  is_published boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add columns if table existed previously without them
alter table public.lessons add column if not exists module_id uuid references public.modules(id) on delete set null;
alter table public.lessons add column if not exists description text;
alter table public.lessons add column if not exists content text;
alter table public.lessons add column if not exists duration_minutes int;
alter table public.lessons add column if not exists is_demo boolean default false;
alter table public.lessons add column if not exists is_published boolean default true;
alter table public.lessons add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_modules_course on public.modules(course_id);
create index if not exists idx_lessons_course on public.lessons(course_id);
create index if not exists idx_lessons_module on public.lessons(module_id);
