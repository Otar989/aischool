-- Временно отключаем RLS для всех таблиц, чтобы устранить бесконечную рекурсию
-- Это позволит системе работать, пока мы не настроим правильные политики

BEGIN;

-- Отключаем RLS для всех основных таблиц
ALTER TABLE IF EXISTS courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS enrollments DISABLE ROW LEVEL SECURITY;

-- Удаляем все существующие политики, которые могут вызывать рекурсию
DROP POLICY IF EXISTS "Users can view published courses" ON courses;
DROP POLICY IF EXISTS "Users can view course lessons" ON lessons;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can view their progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view their enrollments" ON enrollments;

-- Создаем простые политики без рекурсии
CREATE POLICY "Allow all reads on courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow all reads on lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Allow all reads on users" ON users FOR SELECT USING (true);

-- Включаем RLS обратно с простыми политиками
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

COMMIT;
