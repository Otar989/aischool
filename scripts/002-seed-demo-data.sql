-- Seeding demo data for the AI learning platform
-- Insert demo courses
INSERT INTO courses (id, slug, title, description, level, duration_hours, price_cents, is_in_subscription, thumbnail_url) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'chinese-for-suppliers',
    'Разговорный китайский для поставщиков: 7 ситуаций',
    'Практический курс китайского языка для работы с поставщиками. Изучите ключевые фразы и ситуации для успешного ведения бизнеса.',
    'BEGINNER',
    12,
    299000,
    true,
    '/placeholder.svg?height=200&width=300'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'telegram-mini-apps',
    'Telegram Mini Apps: старт за 7 дней',
    'Создайте свое первое мини-приложение для Telegram с нуля. От идеи до публикации в App Store.',
    'INTERMEDIATE',
    20,
    499000,
    true,
    '/placeholder.svg?height=200&width=300'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'ai-prompt-engineering',
    'Инженерия промптов: мастерство работы с ИИ',
    'Научитесь создавать эффективные промпты для получения лучших результатов от ИИ-систем.',
    'ADVANCED',
    8,
    199000,
    false,
    '/placeholder.svg?height=200&width=300'
);

-- Insert demo lessons for Chinese course
INSERT INTO lessons (id, course_id, slug, title, order_index, content_md, estimated_minutes, is_demo) VALUES
(
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440001',
    'introduction-greetings',
    'Урок 1: Знакомство и приветствие',
    1,
    '# Знакомство и приветствие

## Основные фразы

**你好** (nǐ hǎo) - Привет/Здравствуйте
**我叫...** (wǒ jiào...) - Меня зовут...
**很高兴认识您** (hěn gāoxìng rènshi nín) - Очень приятно познакомиться

## Диалог-пример

A: 你好，我叫李明。
B: 你好，李明。我是王小红。很高兴认识您。

## Практическое задание

Представьтесь партнеру по бизнесу, используя изученные фразы.',
    30,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440001',
    'discussing-prices',
    'Урок 2: Обсуждение цен и условий',
    2,
    '# Обсуждение цен и условий

## Ключевые фразы

**多少钱？** (duōshao qián?) - Сколько это стоит?
**价格太高了** (jiàgé tài gāo le) - Цена слишком высокая
**可以便宜一点吗？** (kěyǐ piányi yīdiǎn ma?) - Можно подешевле?

## Числа и валюта

- 一 (yī) - один
- 十 (shí) - десять  
- 百 (bǎi) - сто
- 千 (qiān) - тысяча
- 万 (wàn) - десять тысяч

## Практика

Проведите переговоры о цене товара с поставщиком.',
    45,
    false
),
(
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440001',
    'quality-control',
    'Урок 3: Контроль качества',
    3,
    '# Контроль качества

## Фразы для оценки качества

**质量怎么样？** (zhìliàng zěnmeyàng?) - Какое качество?
**质量很好** (zhìliàng hěn hǎo) - Качество хорошее
**有问题** (yǒu wèntí) - Есть проблема

## Описание дефектов

**破损** (pòsǔn) - повреждение
**颜色不对** (yánsè bù duì) - неправильный цвет
**尺寸不合适** (chǐcùn bù héshì) - неподходящий размер

## Ролевая игра

Обсудите с поставщиком проблемы качества и способы их решения.',
    40,
    false
);

-- Insert demo questions
INSERT INTO questions (id, lesson_id, type, prompt, options_json, correct_answer, rubric_json) VALUES
(
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440011',
    'multiple_choice',
    'Как сказать "Привет" на китайском языке?',
    '["你好", "再见", "谢谢", "对不起"]',
    '你好',
    '{"points": 10, "explanation": "你好 (nǐ hǎo) - стандартное приветствие в китайском языке"}'
),
(
    '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440012',
    'short_answer',
    'Переведите фразу: "Цена слишком высокая"',
    null,
    '价格太高了',
    '{"points": 15, "criteria": ["Правильные иероглифы", "Правильная грамматическая структура", "Соответствие контексту"]}'
);

-- Insert demo coupons
INSERT INTO coupons (code, discount_percent, valid_from, valid_to, max_redemptions) VALUES
('WELCOME10', 10, NOW(), NOW() + INTERVAL '30 days', 100),
('STUDENT20', 20, NOW(), NOW() + INTERVAL '90 days', 50);
