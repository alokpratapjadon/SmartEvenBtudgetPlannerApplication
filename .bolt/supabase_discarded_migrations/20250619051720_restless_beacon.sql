/*
  # Fix Policy Conflicts and Database Schema

  This migration resolves policy naming conflicts and ensures proper database setup.

  1. Drop existing conflicting policies
  2. Recreate all policies with unique names
  3. Ensure proper RLS setup
  4. Add missing constraints and indexes
*/

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

DROP POLICY IF EXISTS "Users can insert own events" ON events;
DROP POLICY IF EXISTS "Users can read own events" ON events;
DROP POLICY IF EXISTS "Users can update own events" ON events;
DROP POLICY IF EXISTS "Users can delete own events" ON events;

DROP POLICY IF EXISTS "Users can insert budget categories for their events" ON budget_categories;
DROP POLICY IF EXISTS "Users can read budget categories for their events" ON budget_categories;
DROP POLICY IF EXISTS "Users can update budget categories for their events" ON budget_categories;
DROP POLICY IF EXISTS "Users can delete budget categories for their events" ON budget_categories;

DROP POLICY IF EXISTS "Users can insert expenses for their events" ON expenses;
DROP POLICY IF EXISTS "Users can read expenses for their events" ON expenses;
DROP POLICY IF EXISTS "Users can update expenses for their events" ON expenses;
DROP POLICY IF EXISTS "Users can delete expenses for their events" ON expenses;

DROP POLICY IF EXISTS "Anyone can read candidates" ON candidates;
DROP POLICY IF EXISTS "Admins can insert candidates" ON candidates;
DROP POLICY IF EXISTS "Admins can update candidates" ON candidates;
DROP POLICY IF EXISTS "Admins can delete candidates" ON candidates;

DROP POLICY IF EXISTS "Users can insert their own vote" ON votes;
DROP POLICY IF EXISTS "Users can read their own vote" ON votes;

-- Ensure RLS is enabled on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create users table policies
CREATE POLICY "users_insert_own_profile" ON users
  FOR INSERT TO authenticated
  WITH CHECK ((uid() = id) AND ((jwt() ->> 'email'::text) = email));

CREATE POLICY "users_read_own_data" ON users
  FOR SELECT TO authenticated
  USING (uid() = id);

CREATE POLICY "users_update_own_data" ON users
  FOR UPDATE TO authenticated
  USING (uid() = id);

-- Create events table policies
CREATE POLICY "events_insert_own" ON events
  FOR INSERT TO authenticated
  WITH CHECK (uid() = "userId");

CREATE POLICY "events_read_own" ON events
  FOR SELECT TO authenticated
  USING (uid() = "userId");

CREATE POLICY "events_update_own" ON events
  FOR UPDATE TO authenticated
  USING (uid() = "userId")
  WITH CHECK (uid() = "userId");

CREATE POLICY "events_delete_own" ON events
  FOR DELETE TO authenticated
  USING (uid() = "userId");

-- Create budget_categories table policies
CREATE POLICY "budget_categories_insert_for_own_events" ON budget_categories
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = budget_categories."eventId"
    AND events."userId" = uid()
  ));

CREATE POLICY "budget_categories_read_for_own_events" ON budget_categories
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = budget_categories."eventId"
    AND events."userId" = uid()
  ));

CREATE POLICY "budget_categories_update_for_own_events" ON budget_categories
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = budget_categories."eventId"
    AND events."userId" = uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = budget_categories."eventId"
    AND events."userId" = uid()
  ));

CREATE POLICY "budget_categories_delete_for_own_events" ON budget_categories
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = budget_categories."eventId"
    AND events."userId" = uid()
  ));

-- Create expenses table policies
CREATE POLICY "expenses_insert_for_own_events" ON expenses
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = expenses."eventId"
    AND events."userId" = uid()
  ));

CREATE POLICY "expenses_read_for_own_events" ON expenses
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = expenses."eventId"
    AND events."userId" = uid()
  ));

CREATE POLICY "expenses_update_for_own_events" ON expenses
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = expenses."eventId"
    AND events."userId" = uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = expenses."eventId"
    AND events."userId" = uid()
  ));

CREATE POLICY "expenses_delete_for_own_events" ON expenses
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = expenses."eventId"
    AND events."userId" = uid()
  ));

-- Create candidates table policies
CREATE POLICY "candidates_read_public" ON candidates
  FOR SELECT TO public
  USING (true);

CREATE POLICY "candidates_insert_admin_only" ON candidates
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = uid()
    AND users.is_admin = true
  ));

CREATE POLICY "candidates_update_admin_only" ON candidates
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = uid()
    AND users.is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = uid()
    AND users.is_admin = true
  ));

CREATE POLICY "candidates_delete_admin_only" ON candidates
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = uid()
    AND users.is_admin = true
  ));

-- Create votes table policies
CREATE POLICY "votes_insert_own" ON votes
  FOR INSERT TO authenticated
  WITH CHECK (uid() = user_id);

CREATE POLICY "votes_read_own" ON votes
  FOR SELECT TO authenticated
  USING (uid() = user_id);

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events("userId");
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events("createdAt");
CREATE INDEX IF NOT EXISTS idx_budget_categories_event_id ON budget_categories("eventId");
CREATE INDEX IF NOT EXISTS idx_expenses_event_id ON expenses("eventId");
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses("categoryId");
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_candidates_name ON candidates(name);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);