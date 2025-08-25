# Промокоды

## Генерация

```
SUPABASE_URL=... SUPABASE_SERVICE_ROLE=... npx ts-node scripts/generate-promo.ts "VIP-START-2025" --max=100 --label="Запуск"
```

## Проверка
Через страницу /promo и API /api/promo/verify.

## Переменные окружения
См. файл lib/.env.example и добавьте их в Vercel Environment Variables.
