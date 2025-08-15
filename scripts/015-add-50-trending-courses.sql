-- Добавляем 50 актуальных и востребованных курсов на 2025 год
BEGIN;

-- 1. ChatGPT для бизнеса
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'ChatGPT для бизнеса: Автоматизация и продуктивность', 'chatgpt-business', 'Изучите как использовать ChatGPT для автоматизации бизнес-процессов, создания контента и повышения продуктивности команды', 4999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 2. NFT и торговля на OpenSea
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'NFT торговля на OpenSea: От новичка до профи', 'nft-opensea-trading', 'Полный курс по созданию, покупке и продаже NFT на крупнейшей площадке OpenSea', 7999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 3. React и Next.js 2025
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'React и Next.js 2025: Современная веб-разработка', 'react-nextjs-2025', 'Изучите последние возможности React 18 и Next.js 15 для создания современных веб-приложений', 8999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 4. Кибербезопасность для начинающих
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Кибербезопасность: Защита данных и систем', 'cybersecurity-basics', 'Основы кибербезопасности, защита от хакерских атак и обеспечение безопасности данных', 6999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 5. TikTok маркетинг
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'TikTok маркетинг: Вирусный контент и продажи', 'tiktok-marketing', 'Создание вирусного контента в TikTok, продвижение бренда и монетизация аудитории', 5999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 6. No-Code разработка
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'No-Code разработка: Создание приложений без кода', 'no-code-development', 'Создавайте веб-приложения и мобильные приложения без программирования с помощью Bubble, Webflow и других платформ', 7499, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 7. Криптовалютный трейдинг
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Криптовалютный трейдинг: Стратегии и анализ', 'crypto-trading', 'Изучите технический анализ, торговые стратегии и риск-менеджмент в криптовалютном трейдинге', 9999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 8. YouTube монетизация
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'YouTube монетизация: От 0 до 100k подписчиков', 'youtube-monetization', 'Создание успешного YouTube канала, набор аудитории и различные способы монетизации контента', 6499, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 9. Блокчейн разработка
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Блокчейн разработка: Смарт-контракты и DeFi', 'blockchain-development', 'Разработка смарт-контрактов на Solidity, создание DeFi приложений и работа с Web3', 12999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 10. Дропшиппинг 2025
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Дропшиппинг 2025: Современные стратегии', 'dropshipping-2025', 'Актуальные методы дропшиппинга, поиск поставщиков, автоматизация и масштабирование бизнеса', 8499, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 11. Midjourney и AI-арт
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Midjourney и AI-арт: Создание изображений с ИИ', 'midjourney-ai-art', 'Мастерство создания потрясающих изображений с помощью Midjourney, Stable Diffusion и других AI-инструментов', 5499, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 12. Instagram Reels
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Instagram Reels: Вирусный контент и продвижение', 'instagram-reels', 'Создание вирусных Reels, алгоритмы Instagram, продвижение личного бренда и бизнеса', 4999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 13. Python для анализа данных
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Python для анализа данных и машинного обучения', 'python-data-analysis', 'Изучите pandas, numpy, matplotlib и scikit-learn для анализа данных и создания ML-моделей', 9499, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 14. Telegram боты
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Telegram боты: Автоматизация и монетизация', 'telegram-bots', 'Создание Telegram ботов для бизнеса, автоматизация процессов и монетизация через ботов', 6999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 15. Figma для дизайнеров
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Figma: Профессиональный UI/UX дизайн', 'figma-ui-ux-design', 'Полный курс по Figma для создания современных интерфейсов, прототипирования и командной работы', 7999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 16. Копирайтинг с AI
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Копирайтинг с AI: Продающие тексты будущего', 'ai-copywriting', 'Использование ChatGPT, Jasper и других AI-инструментов для создания продающих текстов и контента', 5999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 17. Flutter разработка
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Flutter: Кроссплатформенная мобильная разработка', 'flutter-mobile-development', 'Создание мобильных приложений для iOS и Android с помощью Flutter и Dart', 10999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 18. Notion для продуктивности
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Notion: Система продуктивности и управления проектами', 'notion-productivity', 'Создание персональной системы продуктивности в Notion, шаблоны и автоматизация', 3999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 19. Веб3 и метавселенные
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Web3 и метавселенные: Будущее интернета', 'web3-metaverse', 'Изучение Web3 технологий, метавселенных, виртуальной недвижимости и новых возможностей заработка', 8999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 20. Email маркетинг
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Email маркетинг: Автоматизация и конверсия', 'email-marketing', 'Создание эффективных email-кампаний, автоматизация воронок продаж и повышение конверсии', 6499, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 21. Shopify дропшиппинг
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Shopify дропшиппинг: Создание прибыльного магазина', 'shopify-dropshipping', 'Создание и оптимизация Shopify магазина для дропшиппинга, поиск продуктов и масштабирование', 7999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 22. LinkedIn продвижение
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'LinkedIn: Личный бренд и B2B продажи', 'linkedin-personal-brand', 'Построение личного бренда в LinkedIn, нетворкинг и генерация лидов для B2B бизнеса', 5999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 23. Kubernetes и DevOps
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Kubernetes и DevOps: Современная инфраструктура', 'kubernetes-devops', 'Изучение Kubernetes, Docker, CI/CD пайплайнов и современных DevOps практик', 11999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 24. Podcast создание
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Подкастинг: От идеи до монетизации', 'podcast-creation', 'Создание успешного подкаста, техническая сторона, продвижение и способы монетизации', 4999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 25. Google Ads 2025
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Google Ads 2025: Эффективная контекстная реклама', 'google-ads-2025', 'Современные стратегии Google Ads, автоматизация кампаний и максимизация ROI', 7499, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 26. Blender 3D моделирование
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Blender: 3D моделирование и анимация', 'blender-3d-modeling', 'Изучение Blender для создания 3D моделей, анимации и визуализации для игр и фильмов', 8999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 27. Финансовая грамотность
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Финансовая грамотность: Инвестиции и накопления', 'financial-literacy', 'Основы личных финансов, инвестирование, создание пассивного дохода и финансовое планирование', 6999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 28. Unity разработка игр
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Unity: Разработка игр для начинающих', 'unity-game-development', 'Создание 2D и 3D игр в Unity, программирование на C#, публикация в магазинах приложений', 9999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 29. Контент-маркетинг
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Контент-маркетинг: Стратегия и создание контента', 'content-marketing', 'Разработка контент-стратегии, создание вирусного контента и измерение эффективности', 5999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 30. AWS Cloud
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'AWS Cloud: Облачные технологии и архитектура', 'aws-cloud', 'Изучение Amazon Web Services, создание масштабируемых приложений в облаке', 10999, '/placeholder.svg?height=content&width=400', true, NOW(), NOW());

-- 31. Photoshop для дизайнеров
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Photoshop: Профессиональная обработка изображений', 'photoshop-design', 'Мастерство работы в Photoshop для дизайнеров, ретушь, композитинг и создание графики', 6999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 32. Affiliate маркетинг
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Affiliate маркетинг: Партнерские программы и доходы', 'affiliate-marketing', 'Заработок на партнерских программах, выбор ниш, создание воронок и масштабирование', 7999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 33. Vue.js разработка
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Vue.js: Современная фронтенд разработка', 'vuejs-development', 'Изучение Vue.js 3, Composition API, Nuxt.js для создания современных веб-приложений', 8499, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 34. Twitch стриминг
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Twitch стриминг: От новичка до партнера', 'twitch-streaming', 'Создание успешного Twitch канала, техническая настройка, взаимодействие с аудиторией и монетизация', 5499, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 35. SEO оптимизация 2025
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'SEO 2025: Современная поисковая оптимизация', 'seo-optimization-2025', 'Актуальные SEO стратегии, работа с алгоритмами Google, техническое SEO и контент-оптимизация', 7999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 36. After Effects анимация
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'After Effects: Моушн-дизайн и анимация', 'after-effects-animation', 'Создание профессиональной анимации и моушн-графики в Adobe After Effects', 8999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 37. Онлайн-курсы создание
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Создание онлайн-курсов: От идеи до продаж', 'online-course-creation', 'Разработка образовательных продуктов, создание контента, платформы и маркетинг курсов', 9499, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 38. Discord сообщества
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Discord: Создание и монетизация сообществ', 'discord-communities', 'Построение активных Discord сообществ, модерация, боты и способы монетизации', 4999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 39. Canva дизайн
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Canva: Быстрый дизайн для бизнеса', 'canva-design', 'Создание профессиональной графики в Canva для социальных сетей, презентаций и маркетинга', 3999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 40. Webflow разработка
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Webflow: Визуальная веб-разработка без кода', 'webflow-development', 'Создание профессиональных сайтов в Webflow, анимации, CMS и интеграции', 7999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 41. Etsy продажи
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Etsy: Продажи handmade и цифровых товаров', 'etsy-sales', 'Создание успешного Etsy магазина, оптимизация листингов, SEO и масштабирование продаж', 5999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 42. Rust программирование
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Rust: Системное программирование будущего', 'rust-programming', 'Изучение языка Rust для создания быстрых и безопасных системных приложений', 9999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 43. Pinterest маркетинг
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Pinterest маркетинг: Трафик и продажи', 'pinterest-marketing', 'Использование Pinterest для привлечения трафика, создание вирусных пинов и монетизация', 4999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 44. Zapier автоматизация
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Zapier: Автоматизация бизнес-процессов', 'zapier-automation', 'Создание автоматизированных рабочих процессов с помощью Zapier и других no-code инструментов', 5499, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 45. Clubhouse и аудио-контент
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Аудио-контент: Clubhouse, подкасты и голосовой маркетинг', 'audio-content-marketing', 'Создание аудио-контента, работа в Clubhouse, голосовой маркетинг и монетизация', 4999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 46. Airtable базы данных
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Airtable: No-code базы данных для бизнеса', 'airtable-databases', 'Создание мощных баз данных и CRM систем в Airtable без программирования', 4999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 47. Stripe платежи
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Stripe: Интеграция платежных систем', 'stripe-payments', 'Интеграция Stripe в веб-приложения, создание подписок и обработка платежей', 6999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 48. Loom видео-контент
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Loom и видео-контент: Эффективная коммуникация', 'loom-video-content', 'Создание обучающих видео с Loom, видео-коммуникация в команде и продажи через видео', 3999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 49. Calendly автоматизация
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Calendly: Автоматизация встреч и продаж', 'calendly-automation', 'Настройка автоматического планирования встреч, интеграции и оптимизация воронки продаж', 3999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

-- 50. Gumroad цифровые продукты
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'Gumroad: Продажа цифровых продуктов', 'gumroad-digital-products', 'Создание и продажа цифровых продуктов на Gumroad, маркетинг и масштабирование', 5999, '/placeholder.svg?height=300&width=400', true, NOW(), NOW());

COMMIT;
