/*
  # Add missing columns to events table

  1. New Columns
    - `description` (text, nullable) - Optional event description
    - `is_public` (boolean, nullable, default false) - Whether event allows public RSVPs
    - `max_guests` (integer, nullable) - Maximum number of guests allowed
    - `rsvp_deadline` (date, nullable) - Deadline for RSVPs

  2. Changes
    - Add four new optional columns to the events table
    - Set appropriate defaults where needed
    - Ensure columns are nullable as they are optional features

  3. Notes
    - These columns support RSVP functionality and event management features
    - All columns are optional to maintain backward compatibility
*/

-- Add description column for event details
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'description'
  ) THEN
    ALTER TABLE events ADD COLUMN description text;
  END IF;
END $$;

-- Add is_public column for public RSVP functionality
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'is_public'
  ) THEN
    ALTER TABLE events ADD COLUMN is_public boolean DEFAULT false;
  END IF;
END $$;

-- Add max_guests column for guest limit functionality
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'max_guests'
  ) THEN
    ALTER TABLE events ADD COLUMN max_guests integer;
  END IF;
END $$;

-- Add rsvp_deadline column for RSVP deadline functionality
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'rsvp_deadline'
  ) THEN
    ALTER TABLE events ADD COLUMN rsvp_deadline date;
  END IF;
END $$;

-- Add check constraint for max_guests to ensure positive values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'events_max_guests_check'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_max_guests_check CHECK (max_guests > 0);
  END IF;
END $$;

-- Add index for is_public column for efficient querying of public events
CREATE INDEX IF NOT EXISTS events_is_public_idx ON events (is_public);

-- Add index for rsvp_deadline for efficient deadline queries
CREATE INDEX IF NOT EXISTS events_rsvp_deadline_idx ON events (rsvp_deadline);