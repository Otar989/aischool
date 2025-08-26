-- add indexed_at column to course_materials (runs after creation)
alter table public.course_materials add column if not exists indexed_at timestamptz;
create index if not exists idx_course_materials_indexed_at on public.course_materials(indexed_at);
