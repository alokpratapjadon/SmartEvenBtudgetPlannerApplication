/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `type` (text, not null)
      - `date` (date, not null)
      - `location` (text, not null)
      - `budget` (numeric, not null)
      - `guestCount` (integer, not null)
      - `userId` (uuid, foreign key to auth.users)
      - `createdAt` (timestamptz, default now())

  2. Security
    - Enable RLS on `events` table
    - Add policy for users to read/write their own events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  date date NOT NULL,
  location text NOT NULL,
  budget numeric NOT NULL CHECK (budget > 0),
  "guestCount" integer NOT NULL CHECK ("guestCount" > 0),
  "userId" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "createdAt" timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Users can insert own events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = "userId");

-- Create index for better performance
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events("userId");
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events("createdAt");