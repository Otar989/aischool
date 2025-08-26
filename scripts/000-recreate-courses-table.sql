-- Recreate courses table with comprehensive schema expected by seed scripts and application
-- Safe: uses CREATE TABLE IF NOT EXISTS + ADD COLUMN IF NOT EXISTS so it can be run multiple times.

-- Ensure required extension for gen_random_uuid (pgcrypto) if not already
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Base table (id + minimal required columns)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  level TEXT,
  duration_hours INTEGER DEFAULT 0,
  price_cents INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  in_subscription BOOLEAN, -- some scripts use in_subscription
  is_in_subscription BOOLEAN, -- others use is_in_subscription
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

-- Backwards compatibility: some earlier scripts referenced price (DECIMAL) instead of price_cents
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);

-- Add any missing columns individually (idempotent)
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS level TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration_hours INTEGER DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS price_cents INTEGER DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS in_subscription BOOLEAN;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_in_subscription BOOLEAN;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS instructor_name TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS instructor_bio TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS instructor_avatar TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS learning_objectives TEXT[];
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS requirements TEXT[];
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS prerequisites TEXT[];
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1);
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS review_count INTEGER;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS student_count INTEGER;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Indexes (idempotent)
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_courses_set_updated_at ON public.courses;
CREATE TRIGGER trg_courses_set_updated_at BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
