-- Add the missing Chinese for Suppliers course
INSERT INTO courses (
  id,
  slug,
  title,
  description,
  long_description,
  level,
  duration_hours,
  price_cents,
  is_published,
  thumbnail_url,
  image_url,
  instructor_name,
  instructor_bio,
  instructor_avatar,
  learning_objectives,
  requirements,
  rating,
  review_count,
  student_count,
  in_subscription,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'chinese-for-suppliers',
  'Китайский для поставщиков',
  'Изучите деловой китайский язык для эффективного общения с поставщиками из Китая',
  'Этот курс разработан специально для предпринимателей и менеджеров, которые работают с китайскими поставщиками. Вы изучите ключевые фразы, деловую лексику и культурные особенности ведения бизнеса в Китае. Курс включает практические диалоги, примеры переписки и советы по переговорам.',
  'BEGINNER',
  24,
  9900,
  true,
  '/placeholder.svg?height=200&width=300',
  '/placeholder.svg?height=400&width=600',
  'Ли Вэй',
  'Преподаватель китайского языка с 10-летним опытом работы в сфере международной торговли',
  '/placeholder.svg?height=100&width=100',
  ARRAY[
    'Основы делового китайского языка',
    'Ведение переговоров с поставщиками',
    'Понимание китайской деловой культуры',
    'Составление деловых писем на китайском',
    'Обсуждение цен и условий поставки',
    'Решение конфликтных ситуаций'
  ],
  ARRAY[
    'Базовые знания английского языка',
    'Опыт работы с поставщиками (желательно)',
    'Мотивация к изучению китайского языка'
  ],
  4.8,
  127,
  1543,
  true,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Add demo lessons for the course
WITH course_data AS (
  SELECT id FROM courses WHERE slug = 'chinese-for-suppliers'
)
INSERT INTO lessons (
  id,
  course_id,
  title,
  description,
  content,
  duration_minutes,
  order_index,
  is_demo,
  is_published,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  course_data.id,
  lesson_title,
  lesson_description,
  lesson_content,
  lesson_duration,
  lesson_order,
  lesson_is_demo,
  true,
  NOW(),
  NOW()
FROM course_data,
(VALUES 
  ('Введение в деловой китайский', 'Основы произношения и базовая лексика', '# Урок 1: Введение в деловой китайский\n\n## Приветствие\n你好 (nǐ hǎo) - Здравствуйте\n您好 (nín hǎo) - Здравствуйте (вежливо)\n\n## Представление\n我是... (wǒ shì...) - Я...\n我的名字是... (wǒ de míngzi shì...) - Меня зовут...', 15, 1, true),
  ('Знакомство с поставщиком', 'Как представиться и начать деловое общение', '# Урок 2: Знакомство с поставщиком\n\n## Полезные фразы\n很高兴认识您 (hěn gāoxìng rènshi nín) - Очень приятно познакомиться\n我们公司... (wǒmen gōngsī...) - Наша компания...', 20, 2, false),
  ('Обсуждение товаров', 'Описание продукции и технических характеристик', '# Урок 3: Обсуждение товаров\n\n## Лексика\n产品 (chǎnpǐn) - продукт\n质量 (zhìliàng) - качество\n价格 (jiàgé) - цена', 25, 3, false)
) AS lessons_data(lesson_title, lesson_description, lesson_content, lesson_duration, lesson_order, lesson_is_demo);
