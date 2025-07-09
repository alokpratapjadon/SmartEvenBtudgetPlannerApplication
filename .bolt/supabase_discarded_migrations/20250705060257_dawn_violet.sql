/*
  # Database Schema Improvements and Optimizations

  1. Performance Optimizations
    - Add missing composite indexes
    - Optimize existing indexes
    - Add partial indexes for better performance

  2. Data Integrity Enhancements
    - Add additional constraints
    - Improve validation rules
    - Add audit fields

  3. New Features
    - Add event templates
    - Add expense categories
    - Add notification preferences
    - Add event analytics

  4. Security Improvements
    - Enhanced RLS policies
    - Better data validation
*/

-- =============================================
-- PERFORMANCE OPTIMIZATIONS
-- =============================================

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_events_user_date ON events("userId", date);
CREATE INDEX IF NOT EXISTS idx_expenses_event_category ON expenses("eventId", "categoryId");
CREATE INDEX IF NOT EXISTS idx_invitations_event_status ON event_invitations(event_id, status);
CREATE INDEX IF NOT EXISTS idx_reminders_user_event ON event_reminders(user_id, event_id);

-- Add partial indexes for active/pending items
CREATE INDEX IF NOT EXISTS idx_invitations_pending ON event_invitations(event_id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_reminders_unsent ON event_reminders(scheduled_for) WHERE is_sent = false;
CREATE INDEX IF NOT EXISTS idx_events_upcoming ON events(date, "userId") WHERE date >= CURRENT_DATE;

-- =============================================
-- DATA INTEGRITY ENHANCEMENTS
-- =============================================

-- Add check constraints for better data validation
DO $$
BEGIN
  -- Ensure event dates are not in the past (for new events)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'events_future_date_check'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_future_date_check 
    CHECK (date >= CURRENT_DATE OR "createdAt" < CURRENT_DATE);
  END IF;

  -- Ensure RSVP deadline is before event date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'events_rsvp_before_event_check'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_rsvp_before_event_check 
    CHECK (rsvp_deadline IS NULL OR rsvp_deadline <= date);
  END IF;

  -- Ensure expense dates are reasonable (not too far in future/past)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'expenses_reasonable_date_check'
  ) THEN
    ALTER TABLE expenses ADD CONSTRAINT expenses_reasonable_date_check 
    CHECK (date >= CURRENT_DATE - INTERVAL '2 years' AND date <= CURRENT_DATE + INTERVAL '1 year');
  END IF;
END $$;

-- =============================================
-- NEW FEATURE: EVENT TEMPLATES
-- =============================================

CREATE TABLE IF NOT EXISTS event_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  event_type text NOT NULL,
  default_budget_categories jsonb NOT NULL DEFAULT '[]',
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_public boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on event templates
ALTER TABLE event_templates ENABLE ROW LEVEL SECURITY;

-- Policies for event templates
CREATE POLICY "templates_read_own_or_public" ON event_templates
  FOR SELECT TO authenticated
  USING (created_by = auth.uid() OR is_public = true);

CREATE POLICY "templates_insert_own" ON event_templates
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "templates_update_own" ON event_templates
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "templates_delete_own" ON event_templates
  FOR DELETE TO authenticated
  USING (auth.uid() = created_by);

-- Indexes for event templates
CREATE INDEX IF NOT EXISTS idx_event_templates_type ON event_templates(event_type);
CREATE INDEX IF NOT EXISTS idx_event_templates_public ON event_templates(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_event_templates_creator ON event_templates(created_by);

-- =============================================
-- NEW FEATURE: EXPENSE CATEGORIES
-- =============================================

CREATE TABLE IF NOT EXISTS expense_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text, -- Icon name or emoji
  color text, -- Hex color code
  is_default boolean DEFAULT false,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on expense categories
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;

-- Policies for expense categories
CREATE POLICY "expense_categories_read_all" ON expense_categories
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "expense_categories_insert_own" ON expense_categories
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

-- Add some default expense categories
INSERT INTO expense_categories (name, description, icon, color, is_default) VALUES
  ('Food & Catering', 'Meals, snacks, and catering services', '🍽️', '#10b981', true),
  ('Venue', 'Location rental and venue costs', '🏢', '#6366f1', true),
  ('Entertainment', 'Music, DJ, performers, and activities', '🎵', '#f59e0b', true),
  ('Decorations', 'Flowers, lighting, and decorative items', '🎨', '#ec4899', true),
  ('Transportation', 'Travel, parking, and transportation costs', '🚗', '#06b6d4', true),
  ('Photography', 'Professional photography and videography', '📸', '#8b5cf6', true),
  ('Gifts & Favors', 'Guest gifts and party favors', '🎁', '#ef4444', true),
  ('Miscellaneous', 'Other expenses not categorized elsewhere', '📝', '#6b7280', true)
ON CONFLICT DO NOTHING;

-- =============================================
-- NEW FEATURE: EVENT ANALYTICS
-- =============================================

CREATE TABLE IF NOT EXISTS event_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_date date NOT NULL DEFAULT CURRENT_DATE,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on event analytics
ALTER TABLE event_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for event analytics
CREATE POLICY "analytics_read_own_events" ON event_analytics
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_analytics.event_id
    AND events."userId" = auth.uid()
  ));

CREATE POLICY "analytics_insert_own_events" ON event_analytics
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_analytics.event_id
    AND events."userId" = auth.uid()
  ));

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_event_metric ON event_analytics(event_id, metric_name);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON event_analytics(metric_date);

-- =============================================
-- ENHANCED NOTIFICATION PREFERENCES
-- =============================================

-- Add more granular notification preferences
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'notification_preferences'
  ) THEN
    ALTER TABLE users ADD COLUMN notification_preferences jsonb DEFAULT '{
      "email": {
        "invitations": true,
        "reminders": true,
        "updates": true,
        "marketing": false
      },
      "sms": {
        "urgent_reminders": false,
        "event_updates": false
      },
      "push": {
        "reminders": true,
        "invitations": true,
        "updates": false
      }
    }';
  END IF;
END $$;

-- =============================================
-- AUDIT TRAIL ENHANCEMENTS
-- =============================================

-- Add updated_at triggers for key tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at columns where missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE events ADD COLUMN updated_at timestamptz DEFAULT now();
    
    CREATE TRIGGER update_events_updated_at 
      BEFORE UPDATE ON events 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE users ADD COLUMN updated_at timestamptz DEFAULT now();
    
    CREATE TRIGGER update_users_updated_at 
      BEFORE UPDATE ON users 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- =============================================
-- IMPROVED SEARCH CAPABILITIES
-- =============================================

-- Add full-text search indexes
CREATE INDEX IF NOT EXISTS idx_events_search ON events USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || location));
CREATE INDEX IF NOT EXISTS idx_candidates_search ON candidates USING gin(to_tsvector('english', name || ' ' || party));

-- =============================================
-- PERFORMANCE MONITORING
-- =============================================

-- Create a view for event statistics
CREATE OR REPLACE VIEW event_statistics AS
SELECT 
  e.id,
  e.title,
  e.budget,
  COALESCE(SUM(ex.amount), 0) as total_spent,
  e.budget - COALESCE(SUM(ex.amount), 0) as remaining_budget,
  COUNT(DISTINCT inv.id) as total_invitations,
  COUNT(DISTINCT CASE WHEN inv.status = 'accepted' THEN inv.id END) as accepted_invitations,
  COUNT(DISTINCT CASE WHEN inv.status = 'pending' THEN inv.id END) as pending_invitations,
  COALESCE(SUM(CASE WHEN inv.status = 'accepted' THEN inv.guest_count ELSE 0 END), 0) as confirmed_guests
FROM events e
LEFT JOIN expenses ex ON e.id = ex."eventId"
LEFT JOIN event_invitations inv ON e.id = inv.event_id
GROUP BY e.id, e.title, e.budget;

-- Grant access to the view
GRANT SELECT ON event_statistics TO authenticated;

-- =============================================
-- DATA CLEANUP AND MAINTENANCE
-- =============================================

-- Function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- Delete old analytics data (older than 2 years)
  DELETE FROM event_analytics 
  WHERE created_at < CURRENT_DATE - INTERVAL '2 years';
  
  -- Delete old calendar integrations for deleted events
  DELETE FROM event_calendar_integrations 
  WHERE event_id NOT IN (SELECT id FROM events);
  
  -- Update usage count for templates
  UPDATE event_templates 
  SET usage_count = (
    SELECT COUNT(*) 
    FROM events 
    WHERE events.type = event_templates.event_type
  );
  
  RAISE NOTICE 'Data cleanup completed';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SECURITY ENHANCEMENTS
-- =============================================

-- Add function to check if user can access event
CREATE OR REPLACE FUNCTION user_can_access_event(event_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM events 
    WHERE id = event_uuid 
    AND ("userId" = auth.uid() OR is_public = true)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to check admin privileges
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FINAL OPTIMIZATIONS
-- =============================================

-- Analyze tables for better query planning
ANALYZE events;
ANALYZE budget_categories;
ANALYZE expenses;
ANALYZE event_invitations;
ANALYZE event_reminders;
ANALYZE users;
ANALYZE candidates;
ANALYZE votes;

-- Update table statistics
SELECT pg_stat_reset();

RAISE NOTICE 'Database schema improvements completed successfully!';