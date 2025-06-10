/*
  # Create expenses table

  1. New Tables
    - `expenses`
      - `id` (uuid, primary key)
      - `description` (text, not null)
      - `amount` (numeric, not null)
      - `date` (date, not null)
      - `categoryId` (uuid, foreign key to budget_categories)
      - `eventId` (uuid, foreign key to events)
      - `receiptUrl` (text, optional)

  2. Security
    - Enable RLS on `expenses` table
    - Add policy for users to read/write expenses for their events
*/

CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  date date NOT NULL,
  "categoryId" uuid NOT NULL REFERENCES budget_categories(id) ON DELETE CASCADE,
  "eventId" uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  "receiptUrl" text
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read expenses for their events"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = expenses."eventId" 
      AND events."userId" = auth.uid()
    )
  );

CREATE POLICY "Users can insert expenses for their events"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = expenses."eventId" 
      AND events."userId" = auth.uid()
    )
  );

CREATE POLICY "Users can update expenses for their events"
  ON expenses
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = expenses."eventId" 
      AND events."userId" = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = expenses."eventId" 
      AND events."userId" = auth.uid()
    )
  );

CREATE POLICY "Users can delete expenses for their events"
  ON expenses
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = expenses."eventId" 
      AND events."userId" = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS expenses_event_id_idx ON expenses("eventId");
CREATE INDEX IF NOT EXISTS expenses_category_id_idx ON expenses("categoryId");
CREATE INDEX IF NOT EXISTS expenses_date_idx ON expenses(date);