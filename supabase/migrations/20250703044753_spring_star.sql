/*
  # Add missing columns to events table

  1. New Columns
    - `description` (text, optional) - Event description
    - `is_public` (boolean, default false) - Whether event is public
    - `max_guests` (integer, optional) - Maximum number of guests
    - `rsvp_deadline` (date, optional) - RSVP deadline date

  2. Changes
    - Add optional columns to support enhanced event functionality
    - Set appropriate defaults for new columns
*/

-- Add description column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'description'
  ) THEN
    ALTER TABLE events ADD COLUMN description text;
  END IF;
END $$;

-- Add is_public column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'is_public'
  ) THEN
    ALTER TABLE events ADD COLUMN is_public boolean DEFAULT false;
  END IF;
END $$;

-- Add max_guests column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'max_guests'
  ) THEN
    ALTER TABLE events ADD COLUMN max_guests integer;
  END IF;
END $$;

-- Add rsvp_deadline column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'rsvp_deadline'
  ) THEN
    ALTER TABLE events ADD COLUMN rsvp_deadline date;
  END IF;
END $$;

-- Add constraint to ensure max_guests is positive if specified
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'events' AND constraint_name = 'events_max_guests_check'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_max_guests_check CHECK (max_guests IS NULL OR max_guests > 0);
  END IF;
END $$;