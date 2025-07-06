/*
  # Fix RLS policies with correct auth.uid() function

  1. Security
    - Drop all existing policies to avoid conflicts
    - Enable RLS on all tables
    - Create proper RLS policies using auth.uid() instead of uid()
    
  2. Tables affected
    - users
    - events  
    - budget_categories
    - expenses
    - candidates
    - votes
    
  3. Indexes
    - Ensure all necessary indexes exist for performance
*/

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "users_insert_own_profile" ON users;
DROP POLICY IF EXISTS "users_read_own_data" ON users;
DROP POLICY IF EXISTS "users_update_own_data" ON users;

DROP POLICY IF EXISTS "Users can insert own events" ON events;
DROP POLICY IF EXISTS "Users can read own events" ON events;
DROP POLICY IF EXISTS "Users can update own events" ON events;
DROP POLICY IF EXISTS "Users can delete own events" ON events;
DROP POLICY IF EXISTS "events_insert_own" ON events;
DROP POLICY IF EXISTS "events_read_own" ON events;
DROP POLICY IF EXISTS "events_update_own" ON events;
DROP POLICY IF EXISTS "events_delete_own" ON events;

DROP POLICY IF EXISTS "Users can insert budget categories for their events" ON budget_categories;
DROP POLICY IF EXISTS "Users can read budget categories for their events" ON budget_categories;
DROP POLICY IF EXISTS "Users can update budget categories for their events" ON budget_categories;
DROP POLICY IF EXISTS "Users can delete budget categories for their events" ON budget_categories;
DROP POLICY IF EXISTS "budget_categories_insert_for_own_events" ON budget_categories;
DROP POLICY IF EXISTS "budget_categories_read_for_own_events" ON budget_categories;
DROP POLICY IF EXISTS "budget_categories_update_for_own_events" ON budget_categories;
DROP POLICY IF EXISTS "budget_categories_delete_for_own_events" ON budget_categories;

DROP POLICY IF EXISTS "Users can insert expenses for their events" ON expenses;
DROP POLICY IF EXISTS "Users can read expenses for their events" ON expenses;
DROP POLICY IF EXISTS "Users can update expenses for their events" ON expenses;
DROP POLICY IF EXISTS "Users can delete expenses for their events" ON expenses;
DROP POLICY IF EXISTS "expenses_insert_for_own_events" ON expenses;
DROP POLICY IF EXISTS "expenses_read_for_own_events" ON expenses;
DROP POLICY IF EXISTS "expenses_update_for_own_events" ON expenses;
DROP POLICY IF EXISTS "expenses_delete_for_own_events" ON expenses;

DROP POLICY IF EXISTS "Anyone can read candidates" ON candidates;
DROP POLICY IF EXISTS "Admins can insert candidates" ON candidates;
DROP POLICY IF EXISTS "Admins can update candidates" ON candidates;
DROP POLICY IF EXISTS "Admins can delete candidates" ON candidates;
DROP POLICY IF EXISTS "candidates_read_public" ON candidates;
DROP POLICY IF EXISTS "candidates_insert_admin_only" ON candidates;
DROP POLICY IF EXISTS "candidates_update_admin_only" ON candidates;
DROP POLICY IF EXISTS "candidates_delete_admin_only" ON candidates;

DROP POLICY IF EXISTS "Users can insert their own vote" ON votes;
DROP POLICY IF EXISTS "Users can read their own vote" ON votes;
DROP POLICY IF EXISTS "votes_insert_own" ON votes;
DROP POLICY IF EXISTS "votes_read_own" ON votes;

-- Ensure RLS is enabled on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create users table policies
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT TO authenticated
  WITH CHECK ((auth.uid() = id) AND ((auth.jwt() ->> 'email'::text) = email));

CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO public
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Create events table policies
CREATE POLICY "Users can insert their own events" ON events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can read their own events" ON events
  FOR SELECT TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Users can update own events" ON events
  FOR UPDATE TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own events" ON events
  FOR DELETE TO authenticated
  USING (auth.uid() = "userId");

-- Create budget_categories table policies
CREATE POLICY "Users can insert budget categories for their events" ON budget_categories
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = budget_categories."eventId"
    AND events."userId" = auth.uid()
  ));

CREATE POLICY "Users can read budget categories for their events" ON budget_categories
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = budget_categories."eventId"
    AND events."userId" = auth.uid()
  ));

CREATE POLICY "Users can update budget categories for their events" ON budget_categories
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = budget_categories."eventId"
    AND events."userId" = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = budget_categories."eventId"
    AND events."userId" = auth.uid()
  ));

CREATE POLICY "Users can delete budget categories for their events" ON budget_categories
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = budget_categories."eventId"
    AND events."userId" = auth.uid()
  ));

-- Create expenses table policies
CREATE POLICY "Users can insert expenses for their events" ON expenses
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = expenses."eventId"
    AND events."userId" = auth.uid()
  ));

CREATE POLICY "Users can read expenses for their events" ON expenses
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = expenses."eventId"
    AND events."userId" = auth.uid()
  ));

CREATE POLICY "Users can update expenses for their events" ON expenses
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = expenses."eventId"
    AND events."userId" = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = expenses."eventId"
    AND events."userId" = auth.uid()
  ));

CREATE POLICY "Users can delete expenses for their events" ON expenses
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = expenses."eventId"
    AND events."userId" = auth.uid()
  ));

-- Create candidates table policies
CREATE POLICY "Anyone can read candidates" ON candidates
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Admins can insert candidates" ON candidates
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  ));

CREATE POLICY "Admins can update candidates" ON candidates
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  ));

CREATE POLICY "Admins can delete candidates" ON candidates
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  ));

-- Create votes table policies
CREATE POLICY "Users can insert their own vote" ON votes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own vote" ON votes
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events("userId");
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events("createdAt");
CREATE INDEX IF NOT EXISTS budget_categories_event_id_idx ON budget_categories("eventId");
CREATE INDEX IF NOT EXISTS expenses_event_id_idx ON expenses("eventId");
CREATE INDEX IF NOT EXISTS expenses_category_id_idx ON expenses("categoryId");
CREATE INDEX IF NOT EXISTS expenses_date_idx ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_candidates_name ON candidates(name);