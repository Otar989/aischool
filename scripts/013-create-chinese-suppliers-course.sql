-- Create the Chinese for Suppliers course that's being accessed
INSERT INTO courses (
  id,
  title,
  description,
  slug,
  price_cents,
  is_published,
  instructor_name,
  instructor_bio,
  level,
  duration_hours,
  language,
  category,
  learning_objectives,
  prerequisites,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Chinese for Suppliers',
  'Learn essential Chinese business vocabulary and phrases for working with suppliers. Perfect for procurement professionals and business owners who need to communicate effectively with Chinese manufacturers and suppliers.',
  'chinese-for-suppliers',
  9900, -- $99.00
  true, -- Ensure course is published so it can be accessed
  'Li Wei',
  'Native Chinese speaker with 10+ years experience in international business and supply chain management.',
  'Beginner',
  20,
  'Chinese (Mandarin)',
  'Business',
  ARRAY[
    'Master essential supplier communication phrases',
    'Understand product specifications in Chinese',
    'Navigate price negotiations confidently',
    'Build professional relationships with suppliers',
    'Handle quality control discussions'
  ],
  ARRAY[
    'No prior Chinese language experience required',
    'Basic understanding of supply chain processes helpful'
  ],
  NOW(),
  NOW()
);

-- Get the course ID for lessons
DO $$
DECLARE
    course_uuid UUID;
BEGIN
    SELECT id INTO course_uuid FROM courses WHERE slug = 'chinese-for-suppliers';
    
    -- Create sample lessons for the course
    INSERT INTO lessons (
      id,
      course_id,
      title,
      description,
      content,
      order_index,
      duration_minutes,
      is_published,
      created_at,
      updated_at
    ) VALUES 
    (
      gen_random_uuid(),
      course_uuid,
      'Introduction to Business Chinese',
      'Learn basic greetings and introductions for business contexts',
      '{"type": "lesson", "content": "Welcome to Chinese for Suppliers! In this lesson, you will learn essential greetings and how to introduce yourself professionally in Chinese business settings."}',
      1,
      30,
      true,
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      course_uuid,
      'Product Specifications and Quality',
      'Master vocabulary for discussing product details and quality requirements',
      '{"type": "lesson", "content": "Learn how to discuss product specifications, quality standards, and technical requirements with your Chinese suppliers."}',
      2,
      45,
      true,
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      course_uuid,
      'Negotiation and Pricing',
      'Essential phrases for price negotiations and contract discussions',
      '{"type": "lesson", "content": "Master the art of price negotiation and contract discussions in Chinese business culture."}',
      3,
      40,
      true,
      NOW(),
      NOW()
    );
END $$;
