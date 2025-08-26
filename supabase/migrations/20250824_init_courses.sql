-- Initial creation of public.courses table (placed before course_materials migration)
-- Safe & idempotent: uses IF NOT EXISTS and separate ADD COLUMN guards.

-- Required for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  level TEXT,
  duration_hours INTEGER DEFAULT 0,
  price_cents INTEGER DEFAULT 0,
  -- legacy decimal price support
  price DECIMAL(10,2),
  is_published BOOLEAN DEFAULT false,
  in_subscription BOOLEAN,
  is_in_subscription BOOLEAN,
  thumbnail_url TEXT,
  image_url TEXT,
  instructor_name TEXT,
  instructor_bio TEXT,
  instructor_avatar TEXT,
  learning_objectives TEXT[],
  requirements TEXT[],
  prerequisites TEXT[],
  rating NUMERIC(3,1),
  review_count INTEGER,
  student_count INTEGER,
  language TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_courses_set_updated_at ON public.courses;
CREATE TRIGGER trg_courses_set_updated_at BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
