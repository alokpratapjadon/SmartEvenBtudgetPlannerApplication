/*
  # Create budget categories table

  1. New Tables
    - `budget_categories`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `percentage` (numeric, not null)
      - `amount` (numeric, not null)
      - `eventId` (uuid, foreign key to events)

  2. Security
    - Enable RLS on `budget_categories` table
    - Add policy for users to read/write categories for their events
*/

CREATE TABLE IF NOT EXISTS budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  percentage numeric NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  amount numeric NOT NULL CHECK (amount >= 0),
  "eventId" uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE
);

ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read budget categories for their events"
  ON budget_categories
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = budget_categories."eventId" 
      AND events."userId" = auth.uid()
    )
  );

CREATE POLICY "Users can insert budget categories for their events"
  ON budget_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = budget_categories."eventId" 
      AND events."userId" = auth.uid()
    )
  );

CREATE POLICY "Users can update budget categories for their events"
  ON budget_categories
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = budget_categories."eventId" 
      AND events."userId" = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = budget_categories."eventId" 
      AND events."userId" = auth.uid()
    )
  );

CREATE POLICY "Users can delete budget categories for their events"
  ON budget_categories
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = budget_categories."eventId" 
      AND events."userId" = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS budget_categories_event_id_idx ON budget_categories("eventId");