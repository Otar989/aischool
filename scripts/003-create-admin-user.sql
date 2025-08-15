-- Create admin user (this will be handled by Supabase Auth, but we prepare the profile)
-- The actual user creation will be done via Supabase Auth API

-- Insert admin user profile (assuming the auth user will be created first)
-- This is a placeholder - the actual admin user will be created via the application
INSERT INTO users (id, email, full_name, role, created_at, updated_at) 
SELECT 
    id,
    'admin@site.local',
    'System Administrator',
    'ADMIN',
    NOW(),
    NOW()
FROM auth.users 
WHERE email = 'admin@site.local'
ON CONFLICT (id) DO UPDATE SET
    role = 'ADMIN',
    full_name = 'System Administrator',
    updated_at = NOW();

-- If no admin user exists in auth.users, we'll create a placeholder
-- This will be replaced when the actual admin signs up
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@site.local') THEN
        -- Create a temporary UUID for the admin user
        -- This will be replaced when the real admin user is created
        INSERT INTO users (id, email, full_name, role, created_at, updated_at) VALUES
        ('00000000-0000-0000-0000-000000000001', 'admin@site.local', 'System Administrator', 'ADMIN', NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET
            role = 'ADMIN',
            full_name = 'System Administrator',
            updated_at = NOW();
    END IF;
END $$;
