-- Create database schema and enable RLS
-- Enable RLS on courses table
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published courses
CREATE POLICY "Allow public read access to published courses" ON courses
FOR SELECT USING (is_published = true);

-- Enable RLS on lessons table
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published lessons
CREATE POLICY "Allow public read access to published lessons" ON lessons
FOR SELECT USING (is_published = true);

-- Create policy to allow service role full access to courses
CREATE POLICY "Allow service role full access to courses" ON courses
FOR ALL USING (auth.role() = 'service_role');

-- Create policy to allow service role full access to lessons
CREATE POLICY "Allow service role full access to lessons" ON lessons
FOR ALL USING (auth.role() = 'service_role');

-- Insert initial test data if not exists
INSERT INTO courses (id, title, slug, description, price, image_url, is_published, created_at, updated_at)
VALUES 
  (
    gen_random_uuid(),
    'ChatGPT для бизнеса: Автоматизация и продуктивность',
    'chatgpt-business',
    'Изучите как использовать ChatGPT для автоматизации бизнес-процессов, создания контента и повышения продуктивности команды',
    4999,
    '/placeholder.svg?height=400&width=600',
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;
