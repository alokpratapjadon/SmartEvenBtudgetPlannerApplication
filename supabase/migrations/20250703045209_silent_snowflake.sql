/*
  # Add missing columns to events table

  1. Changes
    - Add `description` column (text, nullable) - for event descriptions
    - Add `is_public` column (boolean, default false) - for public RSVP setting
    - Add `max_guests` column (integer, nullable) - for maximum guest limit
    - Add `rsvp_deadline` column (date, nullable) - for RSVP deadline

  2. Security
    - No changes to existing RLS policies needed as they already cover the table
*/

-- Add description column for event descriptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'description'
  ) THEN
    ALTER TABLE events ADD COLUMN description text;
  END IF;
END $$;

-- Add is_public column for public RSVP setting
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'is_public'
  ) THEN
    ALTER TABLE events ADD COLUMN is_public boolean DEFAULT false;
  END IF;
END $$;

-- Add max_guests column for maximum guest limit
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'max_guests'
  ) THEN
    ALTER TABLE events ADD COLUMN max_guests integer;
  END IF;
END $$;

-- Add rsvp_deadline column for RSVP deadline
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'rsvp_deadline'
  ) THEN
    ALTER TABLE events ADD COLUMN rsvp_deadline date;
  END IF;
END $$;

-- Add constraint to ensure max_guests is positive when set
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'events_max_guests_check'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_max_guests_check CHECK (max_guests IS NULL OR max_guests > 0);
  END IF;
END $$;