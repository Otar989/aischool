-- 019-fix-lessons-schema.sql
-- Выравнивание схемы под новый AI функционал.
-- Запускать ОДИН раз в Prod (или безопасно повторно — все IF NOT EXISTS).

-- 1. COURSES: добавить недостающие столбцы
ALTER TABLE courses ADD COLUMN IF NOT EXISTS price numeric DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true;

-- 2. LESSONS: добавить недостающие столбцы
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS duration integer;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true;
-- Если есть duration_minutes и нет duration – скопируем значения.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='lessons' AND column_name='duration_minutes'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='lessons' AND column_name='duration_copied_flag'
  ) THEN
    -- временный флаг чтобы не копировать повторно
    ALTER TABLE lessons ADD COLUMN duration_copied_flag boolean DEFAULT false;
    UPDATE lessons SET duration = COALESCE(duration, duration_minutes::int);
    UPDATE lessons SET duration_copied_flag = true;
  END IF;
END$$;

-- 3. Индексы
CREATE INDEX IF NOT EXISTS idx_courses_published_created_at ON courses(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lessons_course_order ON lessons(course_id, order_index);

-- 4. Включить RLS (безопасно если уже включено)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- 5. Политики: только опубликованные публично
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename='courses' AND policyname='public_select_published_courses'
  ) THEN
    CREATE POLICY public_select_published_courses ON courses
      FOR SELECT USING (is_published = true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename='lessons' AND policyname='public_select_published_lessons'
  ) THEN
    CREATE POLICY public_select_published_lessons ON lessons
      FOR SELECT USING (is_published = true);
  END IF;
END$$;

-- 6. (Опционально) политика для service role полного доступа (если нужно; обычно ключ service role обходит RLS, но добавим безопасно)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='courses' AND policyname='service_all_courses'
  ) THEN
    CREATE POLICY service_all_courses ON courses FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='lessons' AND policyname='service_all_lessons'
  ) THEN
    CREATE POLICY service_all_lessons ON lessons FOR ALL USING (auth.role() = 'service_role');
  END IF;
END$$;

-- 7. Проставить order_index если NULL (например по created_at)
UPDATE lessons
SET order_index = sub.rn - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY course_id ORDER BY created_at, id) rn
  FROM lessons
) sub
WHERE lessons.id = sub.id AND (lessons.order_index IS NULL OR lessons.order_index = 0);

-- 8. Гарантировать duration не NULL (минимум 5 минут) если отсутствует
UPDATE lessons SET duration = 5 WHERE duration IS NULL;

-- 9. Публикуем курсы/уроки без флага (минимально чтобы были видимы)
UPDATE courses SET is_published = true WHERE is_published IS NULL;
UPDATE lessons SET is_published = true WHERE is_published IS NULL;

-- 10. Краткая проверка (вернёт несколько строк)
-- SELECT id, title, is_published FROM courses ORDER BY created_at DESC LIMIT 5;
-- SELECT id, course_id, title, order_index, duration, is_published FROM lessons ORDER BY created_at DESC LIMIT 5;

-- Готово. После применения: вызвать POST /api/ai-courses/seed (если нужно автогенерировать) и перезагрузить страницу.
