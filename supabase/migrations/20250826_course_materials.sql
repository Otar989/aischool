-- Course materials & RAG support
create table if not exists public.course_materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  lesson_id uuid references public.lessons(id) on delete set null,
  kind text check (kind in ('video','audio','pdf','image','markdown','link','download')) not null,
  title text not null,
  description text,
  src text not null,
  meta jsonb,
  is_public boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_course_materials_course on public.course_materials(course_id);
create index if not exists idx_course_materials_lesson on public.course_materials(lesson_id);
create index if not exists idx_course_materials_kind on public.course_materials(kind);

create extension if not exists vector;
create table if not exists public.material_chunks (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.course_materials(id) on delete cascade,
  chunk text not null,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

alter table public.courses add column if not exists is_published boolean not null default true;
create index if not exists idx_courses_published on public.courses(is_published);
