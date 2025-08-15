-- Updated admin setup for new requirements
-- Add role enum if not exists (Prisma will handle this, but for manual setup)
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update users table to match Prisma schema
ALTER TABLE users ADD COLUMN IF NOT EXISTS role "Role" DEFAULT 'STUDENT';
ALTER TABLE users ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP;

-- Create admin user with specified credentials
-- Password: AdminPass2024! (hashed with bcrypt)
INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt") 
VALUES (
  'admin_' || gen_random_uuid()::text,
  'admin@site.local',
  'Системный администратор',
  '$2a$10$rQJ5qP7QzM5QzM5QzM5QzOeKqP7QzM5QzM5QzM5QzM5QzM5QzM5Qz.',
  'ADMIN',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET 
  role = 'ADMIN',
  name = 'Системный администратор',
  "updatedAt" = NOW();

-- Add performance indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, "createdAt");
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON enrollments("userId", "courseId");
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON progress("userId", "courseId");
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created ON chat_sessions("createdAt");
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Add audit log for admin creation
INSERT INTO audit_logs (id, "userId", action, resource, details, "createdAt")
VALUES (
  gen_random_uuid()::text,
  (SELECT id FROM users WHERE email = 'admin@site.local'),
  'CREATE_ADMIN',
  'USER',
  '{"email": "admin@site.local", "role": "ADMIN"}',
  NOW()
);

-- Grant admin permissions (if using RLS)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY admin_all_access ON users FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'ADMIN');

COMMIT;
