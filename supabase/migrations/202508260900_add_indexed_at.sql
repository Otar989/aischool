-- SAFE NO-OP VERSION: if course_materials not yet created, skip silently
DO $$
BEGIN
	PERFORM 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'course_materials';
	IF NOT FOUND THEN
		RETURN; -- table not created yet, skip
	END IF;
	ALTER TABLE public.course_materials ADD COLUMN IF NOT EXISTS indexed_at timestamptz;
	CREATE INDEX IF NOT EXISTS idx_course_materials_indexed_at ON public.course_materials(indexed_at);
END $$;
