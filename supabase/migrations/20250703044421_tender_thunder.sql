/*
  # Add RSVP, Calendar Integration, and Reminders Features

  1. New Tables
    - `event_invitations` - Track event invitations and RSVPs
    - `event_reminders` - Store reminder settings for events
    - `event_calendar_integrations` - Track calendar sync status

  2. Enhanced Tables
    - Add fields to `events` table for invitation management
    - Add notification preferences to `users` table

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for data access
*/

-- Add new columns to events table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'is_public'
  ) THEN
    ALTER TABLE events ADD COLUMN is_public boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'max_guests'
  ) THEN
    ALTER TABLE events ADD COLUMN max_guests integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'rsvp_deadline'
  ) THEN
    ALTER TABLE events ADD COLUMN rsvp_deadline date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'description'
  ) THEN
    ALTER TABLE events ADD COLUMN description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'event_url'
  ) THEN
    ALTER TABLE events ADD COLUMN event_url text;
  END IF;
END $$;

-- Add notification preferences to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'email_notifications'
  ) THEN
    ALTER TABLE users ADD COLUMN email_notifications boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'sms_notifications'
  ) THEN
    ALTER TABLE users ADD COLUMN sms_notifications boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE users ADD COLUMN phone_number text;
  END IF;
END $$;

-- Create event_invitations table
CREATE TABLE IF NOT EXISTS event_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  invitee_email text NOT NULL,
  invitee_name text,
  invited_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'maybe')),
  guest_count integer DEFAULT 1 CHECK (guest_count > 0),
  dietary_restrictions text,
  special_requests text,
  invited_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create event_reminders table
CREATE TABLE IF NOT EXISTS event_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reminder_type text NOT NULL CHECK (reminder_type IN ('email', 'sms', 'push')),
  reminder_time text NOT NULL, -- e.g., '1 day', '2 hours', '30 minutes'
  message text,
  is_sent boolean DEFAULT false,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create event_calendar_integrations table
CREATE TABLE IF NOT EXISTS event_calendar_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  calendar_provider text NOT NULL CHECK (calendar_provider IN ('google', 'outlook', 'apple', 'ical')),
  external_event_id text,
  sync_status text NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed', 'removed')),
  last_synced_at timestamptz,
  sync_error text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE event_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_calendar_integrations ENABLE ROW LEVEL SECURITY;

-- Create policies for event_invitations
CREATE POLICY "invitations_insert_for_own_events" ON event_invitations
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_invitations.event_id
    AND events."userId" = auth.uid()
  ));

CREATE POLICY "invitations_read_for_own_events_or_invitee" ON event_invitations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_invitations.event_id
      AND events."userId" = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.email = event_invitations.invitee_email
    )
  );

CREATE POLICY "invitations_update_for_own_events_or_invitee" ON event_invitations
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_invitations.event_id
      AND events."userId" = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.email = event_invitations.invitee_email
    )
  );

CREATE POLICY "invitations_delete_for_own_events" ON event_invitations
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_invitations.event_id
    AND events."userId" = auth.uid()
  ));

-- Create policies for event_reminders
CREATE POLICY "reminders_insert_own" ON event_reminders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reminders_read_own" ON event_reminders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "reminders_update_own" ON event_reminders
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "reminders_delete_own" ON event_reminders
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for event_calendar_integrations
CREATE POLICY "calendar_integrations_insert_own" ON event_calendar_integrations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "calendar_integrations_read_own" ON event_calendar_integrations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "calendar_integrations_update_own" ON event_calendar_integrations
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "calendar_integrations_delete_own" ON event_calendar_integrations
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_invitations_event_id ON event_invitations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_invitations_invitee_email ON event_invitations(invitee_email);
CREATE INDEX IF NOT EXISTS idx_event_invitations_status ON event_invitations(status);
CREATE INDEX IF NOT EXISTS idx_event_invitations_invited_by ON event_invitations(invited_by);

CREATE INDEX IF NOT EXISTS idx_event_reminders_event_id ON event_reminders(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reminders_user_id ON event_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_event_reminders_scheduled_for ON event_reminders(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_event_reminders_is_sent ON event_reminders(is_sent);

CREATE INDEX IF NOT EXISTS idx_event_calendar_integrations_event_id ON event_calendar_integrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_calendar_integrations_user_id ON event_calendar_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_calendar_integrations_provider ON event_calendar_integrations(calendar_provider);

-- Add constraints (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'unique_event_invitee'
  ) THEN
    ALTER TABLE event_invitations ADD CONSTRAINT unique_event_invitee UNIQUE (event_id, invitee_email);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'unique_event_user_reminder'
  ) THEN
    ALTER TABLE event_reminders ADD CONSTRAINT unique_event_user_reminder UNIQUE (event_id, user_id, reminder_type, reminder_time);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'unique_event_user_provider'
  ) THEN
    ALTER TABLE event_calendar_integrations ADD CONSTRAINT unique_event_user_provider UNIQUE (event_id, user_id, calendar_provider);
  END IF;
END $$;