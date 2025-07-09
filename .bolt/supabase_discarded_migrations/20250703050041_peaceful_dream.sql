/*
  # Fix Events Table Schema - Add Missing Columns

  This migration adds all the missing columns that the application expects
  in the events table to resolve the schema cache errors.

  1. Changes to Events Table
    - Add `description` column (text, nullable) for event descriptions
    - Add `is_public` column (boolean, default false) for public RSVP functionality
    - Add `max_guests` column (integer, nullable) for guest limits
    - Add `rsvp_deadline` column (date, nullable) for RSVP deadlines

  2. Safety
    - Uses IF NOT EXISTS checks to prevent errors if columns already exist
    - Adds appropriate constraints and indexes
*/

-- Add description column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'events' 
    AND column_name = 'description'
  ) THEN
    ALTER TABLE events ADD COLUMN description text;
    RAISE NOTICE 'Added description column to events table';
  ELSE
    RAISE NOTICE 'Description column already exists in events table';
  END IF;
END $$;

-- Add is_public column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'events' 
    AND column_name = 'is_public'
  ) THEN
    ALTER TABLE events ADD COLUMN is_public boolean DEFAULT false;
    RAISE NOTICE 'Added is_public column to events table';
  ELSE
    RAISE NOTICE 'is_public column already exists in events table';
  END IF;
END $$;

-- Add max_guests column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'events' 
    AND column_name = 'max_guests'
  ) THEN
    ALTER TABLE events ADD COLUMN max_guests integer;
    RAISE NOTICE 'Added max_guests column to events table';
  ELSE
    RAISE NOTICE 'max_guests column already exists in events table';
  END IF;
END $$;

-- Add rsvp_deadline column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'events' 
    AND column_name = 'rsvp_deadline'
  ) THEN
    ALTER TABLE events ADD COLUMN rsvp_deadline date;
    RAISE NOTICE 'Added rsvp_deadline column to events table';
  ELSE
    RAISE NOTICE 'rsvp_deadline column already exists in events table';
  END IF;
END $$;

-- Add constraint for max_guests (only if column exists and constraint doesn't exist)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'events' 
    AND column_name = 'max_guests'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_schema = 'public'
    AND table_name = 'events'
    AND constraint_name = 'events_max_guests_positive'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_max_guests_positive CHECK (max_guests IS NULL OR max_guests > 0);
    RAISE NOTICE 'Added max_guests constraint to events table';
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS events_is_public_idx ON events (is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS events_rsvp_deadline_idx ON events (rsvp_deadline) WHERE rsvp_deadline IS NOT NULL;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';