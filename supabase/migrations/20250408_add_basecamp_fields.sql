
-- Add Basecamp fields to profiles if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'basecamp_connected'
    ) THEN
        ALTER TABLE public.profiles
        ADD COLUMN basecamp_connected BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'basecamp_email'
    ) THEN
        ALTER TABLE public.profiles
        ADD COLUMN basecamp_email TEXT;
    END IF;
END $$;
