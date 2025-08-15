-- Create test users for login testing
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@aischool.ru',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
), (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'otar989@gmail.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Create corresponding user records
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'admin@aischool.ru' THEN 'Администратор'
    ELSE 'Отар'
  END,
  CASE 
    WHEN au.email = 'admin@aischool.ru' THEN 'admin'
    ELSE 'student'
  END,
  now(),
  now()
FROM auth.users au
WHERE au.email IN ('admin@aischool.ru', 'otar989@gmail.com')
ON CONFLICT (id) DO NOTHING;
