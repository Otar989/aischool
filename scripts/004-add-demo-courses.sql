-- Add demo courses for testing
INSERT INTO courses (id, title, slug, description, price_cents, is_published, created_at, updated_at) VALUES
('course-1', 'Основы китайского языка', 'chinese-basics', 'Изучите основы китайского языка с нашим AI-преподавателем. Включает произношение, базовую грамматику и повседневную лексику.', 2990, true, NOW(), NOW()),
('course-2', 'Деловой китайский', 'business-chinese', 'Продвинутый курс делового китайского языка для профессионального общения.', 4990, true, NOW(), NOW()),
('course-3', 'HSK Подготовка', 'hsk-preparation', 'Подготовка к экзамену HSK всех уровней с практическими заданиями.', 3990, true, NOW(), NOW())
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- Add demo lessons for the first course
INSERT INTO lessons (id, course_id, title, slug, content, order_index, created_at, updated_at) VALUES
('lesson-1-1', 'course-1', 'Введение в китайский язык', 'introduction', 'Добро пожаловать в мир китайского языка! В этом уроке мы изучим основы.', 1, NOW(), NOW()),
('lesson-1-2', 'course-1', 'Произношение и тоны', 'pronunciation', 'Изучаем четыре тона китайского языка и правильное произношение.', 2, NOW(), NOW()),
('lesson-1-3', 'course-1', 'Базовые фразы', 'basic-phrases', 'Учим первые полезные фразы для повседневного общения.', 3, NOW(), NOW())
ON CONFLICT (slug, course_id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();
