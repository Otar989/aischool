-- Create all missing courses that are referenced in the courses page
-- This ensures all course links work properly

-- Insert telegram-mini-apps course
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Telegram Mini Apps: старт за 7 дней',
  'telegram-mini-apps',
  'Создайте свое первое мини-приложение для Telegram с нуля. От идеи до публикации в App Store.',
  4990,
  '/telegram-mini-app-dev.png',
  true,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Insert ai-prompt-engineering course
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Инженерия промптов: мастерство работы с ИИ',
  'ai-prompt-engineering',
  'Научитесь создавать эффективные промпты для получения лучших результатов от ИИ-систем.',
  1990,
  '/ai-prompt-dashboard.png',
  true,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Insert python-automation course
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Python для автоматизации бизнес-процессов',
  'python-automation',
  'Автоматизируйте рутинные задачи с помощью Python. Практические кейсы для офисной работы.',
  3990,
  '/python-automation-business.png',
  true,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Insert excel-advanced course
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Excel: от новичка до эксперта',
  'excel-advanced',
  'Полный курс по Excel с практическими заданиями. Формулы, сводные таблицы, макросы и BI.',
  2490,
  '/placeholder-sxs4e.png',
  true,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Insert digital-marketing course
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Цифровой маркетинг: полный гид',
  'digital-marketing',
  'Изучите все каналы цифрового маркетинга: SEO, контекст, соцсети, email и аналитику.',
  3490,
  '/digital-marketing-dashboard.png',
  true,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Add sample lessons for telegram-mini-apps course
INSERT INTO lessons (id, course_id, title, slug, order_index, content, duration_minutes, is_published, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  c.id,
  'Введение в Telegram Mini Apps',
  'introduction-to-telegram-mini-apps',
  1,
  '# Введение в Telegram Mini Apps

## Что такое Telegram Mini Apps?

Telegram Mini Apps - это веб-приложения, которые работают внутри Telegram. Они позволяют создавать интерактивные сервисы прямо в мессенджере.

## Возможности Mini Apps

- Полноценный веб-интерфейс
- Интеграция с Telegram API
- Доступ к данным пользователя
- Встроенные платежи

## Примеры успешных Mini Apps

1. Игры и развлечения
2. Интернет-магазины
3. Сервисы доставки
4. Образовательные платформы

## Что мы изучим в курсе

- Настройка среды разработки
- Создание первого Mini App
- Работа с Telegram API
- Публикация в App Store',
  45,
  true,
  NOW(),
  NOW()
FROM courses c WHERE c.slug = 'telegram-mini-apps'
ON CONFLICT DO NOTHING;

-- Add sample lessons for ai-prompt-engineering course
INSERT INTO lessons (id, course_id, title, slug, order_index, content, duration_minutes, is_published, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  c.id,
  'Основы инженерии промптов',
  'prompt-engineering-basics',
  1,
  '# Основы инженерии промптов

## Что такое промпт?

Промпт - это инструкция или запрос, который вы даете ИИ-системе для получения желаемого результата.

## Принципы эффективных промптов

1. **Ясность** - четко формулируйте задачу
2. **Контекст** - предоставляйте необходимую информацию
3. **Структура** - используйте логичную последовательность
4. **Примеры** - показывайте желаемый формат ответа

## Типы промптов

- Информационные запросы
- Творческие задания
- Аналитические задачи
- Техническое программирование

## Практическое задание

Создайте промпт для генерации описания товара для интернет-магазина.',
  40,
  true,
  NOW(),
  NOW()
FROM courses c WHERE c.slug = 'ai-prompt-engineering'
ON CONFLICT DO NOTHING;

-- Add sample lessons for python-automation course
INSERT INTO lessons (id, course_id, title, slug, order_index, content, duration_minutes, is_published, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  c.id,
  'Автоматизация работы с файлами',
  'file-automation-python',
  1,
  '# Автоматизация работы с файлами

## Зачем автоматизировать работу с файлами?

- Экономия времени на рутинных задачах
- Снижение количества ошибок
- Обработка больших объемов данных

## Основные библиотеки Python

\`\`\`python
import os
import shutil
import pandas as pd
from pathlib import Path
