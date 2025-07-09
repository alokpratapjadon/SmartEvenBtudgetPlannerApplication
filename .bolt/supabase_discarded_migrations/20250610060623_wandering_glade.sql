/*
  # Complete Database Schema for Smart Event Budget Planner

  This migration creates the complete database schema including:
  1. Events table with user authentication
  2. Budget categories table linked to events
  3. Expenses table linked to both events and categories
  4. Row Level Security (RLS) policies for data isolation
  5. Performance indexes
  6. Data validation constraints

  All tables are secured with RLS to ensure users can only access their own data.
*/

-- =============================================
-- EVENTS TABLE
-- =============================================

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

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Events
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

-- Indexes for Events
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events("userId");
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events("createdAt");

-- =============================================
-- BUDGET CATEGORIES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  percentage numeric NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  amount numeric NOT NULL CHECK (amount >= 0),
  "eventId" uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Budget Categories
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

-- Indexes for Budget Categories
CREATE INDEX IF NOT EXISTS budget_categories_event_id_idx ON budget_categories("eventId");

-- =============================================
-- EXPENSES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  date date NOT NULL,
  "categoryId" uuid NOT NULL REFERENCES budget_categories(id) ON DELETE CASCADE,
  "eventId" uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  "receiptUrl" text
);

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Expenses
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

-- Indexes for Expenses
CREATE INDEX IF NOT EXISTS expenses_event_id_idx ON expenses("eventId");
CREATE INDEX IF NOT EXISTS expenses_category_id_idx ON expenses("categoryId");
CREATE INDEX IF NOT EXISTS expenses_date_idx ON expenses(date);