-- Fix RLS policies to resolve infinite recursion error
-- This script removes problematic policies and creates simple, working ones

BEGIN;

-- Drop all existing RLS policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Published courses are viewable" ON courses;
DROP POLICY IF EXISTS "Authenticated users can view courses" ON courses;

DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON lessons;
DROP POLICY IF EXISTS "Published lessons are viewable" ON lessons;
DROP POLICY IF EXISTS "Authenticated users can view lessons" ON lessons;

DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

DROP POLICY IF EXISTS "Users can view own purchases" ON course_purchases;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;

DROP POLICY IF EXISTS "Users can view own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can view own chat messages" ON chat_messages;

-- Disable RLS temporarily to avoid conflicts
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies for public access
-- Enable RLS and create simple policies for courses (public read access)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published courses" ON courses
    FOR SELECT USING (is_published = true);

-- Enable RLS and create simple policies for lessons (public read access)
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view lessons of published courses" ON lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM courses 
            WHERE courses.id = lessons.course_id 
            AND courses.is_published = true
        )
    );

-- Create policies for user-specific data (only for authenticated users)
-- Users table - users can only see their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- User progress - users can only see/modify their own progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Course purchases - users can only see their own purchases
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own purchases" ON course_purchases
    FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions - users can only see their own subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Chat sessions - users can only see their own chat sessions
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat sessions" ON chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chat messages - users can only see messages from their own sessions
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own chat messages" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_sessions 
            WHERE chat_sessions.id = chat_messages.session_id 
            AND chat_sessions.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_sessions 
            WHERE chat_sessions.id = chat_messages.session_id 
            AND chat_sessions.user_id = auth.uid()
        )
    );

-- Keep coupons and payments without RLS for now (admin-only tables)
-- These will be handled by application-level security

COMMIT;
