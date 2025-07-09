/*
  Manual Migration Steps - Run these commands one by one in Supabase SQL Editor
  
  IMPORTANT: Run each section separately and check for errors before proceeding
*/

-- Step 1: Drop all existing policies to avoid conflicts
-- Run this first to clean up any existing policies

DROP POLICY IF EXISTS "Users can insert their own events" ON events;
DROP POLICY IF EXISTS "Users can read their own events" ON events;
DROP POLICY IF EXISTS "Users can update own events" ON events;
DROP POLICY IF EXISTS "Users can delete own events" ON events;
DROP POLICY IF EXISTS "event_insert_policy_for_users" ON events;
DROP POLICY IF EXISTS "events_insert_own" ON events;
DROP POLICY IF EXISTS "events_read_own" ON events;
DROP POLICY IF EXISTS "events_update_own" ON events;
DROP POLICY IF EXISTS "events_delete_own" ON events;

-- Step 2: Add missing columns to events table
-- Run each ALTER TABLE command separately

ALTER TABLE events ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_guests integer;
ALTER TABLE events ADD COLUMN IF NOT EXISTS rsvp_deadline date;
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_url text;

-- Step 3: Add constraints for new columns
-- Run these one by one

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'events_max_guests_check'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_max_guests_check CHECK ((max_guests IS NULL) OR (max_guests > 0));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'events_max_guests_positive'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_max_guests_positive CHECK ((max_guests IS NULL) OR (max_guests > 0));
  END IF;
END $$;

-- Step 4: Create indexes for new columns
-- Run these one by one

CREATE INDEX IF NOT EXISTS events_is_public_idx ON events USING btree (is_public) WHERE (is_public = true);
CREATE INDEX IF NOT EXISTS events_rsvp_deadline_idx ON events USING btree (rsvp_deadline) WHERE (rsvp_deadline IS NOT NULL);

-- Step 5: Create new RLS policies for events
-- Run these one by one

CREATE POLICY "events_insert_own" ON events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "events_read_own" ON events
  FOR SELECT TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "events_update_own" ON events
  FOR UPDATE TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "events_delete_own" ON events
  FOR DELETE TO authenticated
  USING (auth.uid() = "userId");

-- Step 6: Create event_invitations table if it doesn't exist

CREATE TABLE IF NOT EXISTS event_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  invitee_email text NOT NULL,
  invitee_name text,
  invited_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text, 'maybe'::text])),
  guest_count integer DEFAULT 1 CHECK (guest_count > 0),
  dietary_restrictions text,
  special_requests text,
  invited_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, invitee_email)
);

-- Step 7: Enable RLS and create policies for event_invitations

ALTER TABLE event_invitations ENABLE ROW LEVEL SECURITY;

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
    ) OR 
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
    ) OR 
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

-- Step 8: Create indexes for event_invitations

CREATE INDEX IF NOT EXISTS idx_event_invitations_event_id ON event_invitations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_invitations_invitee_email ON event_invitations(invitee_email);
CREATE INDEX IF NOT EXISTS idx_event_invitations_invited_by ON event_invitations(invited_by);
CREATE INDEX IF NOT EXISTS idx_event_invitations_status ON event_invitations(status);
CREATE UNIQUE INDEX IF NOT EXISTS unique_event_invitee ON event_invitations(event_id, invitee_email);

-- Step 9: Create event_reminders table if it doesn't exist

CREATE TABLE IF NOT EXISTS event_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reminder_type text NOT NULL CHECK (reminder_type = ANY (ARRAY['email'::text, 'sms'::text, 'push'::text])),
  reminder_time text NOT NULL,
  message text,
  is_sent boolean DEFAULT false,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id, reminder_type, reminder_time)
);

-- Step 10: Enable RLS and create policies for event_reminders

ALTER TABLE event_reminders ENABLE ROW LEVEL SECURITY;

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

-- Step 11: Create indexes for event_reminders

CREATE INDEX IF NOT EXISTS idx_event_reminders_event_id ON event_reminders(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reminders_user_id ON event_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_event_reminders_is_sent ON event_reminders(is_sent);
CREATE INDEX IF NOT EXISTS idx_event_reminders_scheduled_for ON event_reminders(scheduled_for);
CREATE UNIQUE INDEX IF NOT EXISTS unique_event_user_reminder ON event_reminders(event_id, user_id, reminder_type, reminder_time);

-- Step 12: Create event_calendar_integrations table if it doesn't exist

CREATE TABLE IF NOT EXISTS event_calendar_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  calendar_provider text NOT NULL CHECK (calendar_provider = ANY (ARRAY['google'::text, 'outlook'::text, 'apple'::text, 'ical'::text])),
  external_event_id text,
  sync_status text NOT NULL DEFAULT 'pending' CHECK (sync_status = ANY (ARRAY['pending'::text, 'synced'::text, 'failed'::text, 'removed'::text])),
  last_synced_at timestamptz,
  sync_error text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id, calendar_provider)
);

-- Step 13: Enable RLS and create policies for event_calendar_integrations

ALTER TABLE event_calendar_integrations ENABLE ROW LEVEL SECURITY;

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

-- Step 14: Create indexes for event_calendar_integrations

CREATE INDEX IF NOT EXISTS idx_event_calendar_integrations_event_id ON event_calendar_integrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_calendar_integrations_user_id ON event_calendar_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_calendar_integrations_provider ON event_calendar_integrations(calendar_provider);
CREATE UNIQUE INDEX IF NOT EXISTS unique_event_user_provider ON event_calendar_integrations(event_id, user_id, calendar_provider);

-- Step 15: Add missing columns to users table

ALTER TABLE users ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS sms_notifications boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number text;

-- COMPLETED: All migration steps
-- Your database should now be fully updated with all required tables and columns